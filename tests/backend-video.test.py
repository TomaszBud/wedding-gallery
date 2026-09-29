import ast
import json
import unittest
from pathlib import Path
from datetime import datetime, timezone
from unittest.mock import Mock
import uuid
import time

ROOT = Path(__file__).resolve().parents[1]
def load_functions(path, names, env):
    tree = ast.parse((ROOT / path).read_text())
    tree.body = [n for n in tree.body if isinstance(n, (ast.FunctionDef, ast.Assign)) and
                 (isinstance(n, ast.FunctionDef) and n.name in names or
                  isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in names for t in n.targets))]
    exec(compile(tree, path, 'exec'), env)
    return env

class VideoTests(unittest.TestCase):
    def test_signing_limits_per_file(self):
        s3, table = Mock(), Mock()
        s3.generate_presigned_post.return_value = {}
        env = load_functions('backend/functions/create_upload_url/lambda_function.py',
            {'handler','response','MAX_FILE_SIZE','MAX_VIDEO_SIZE','ALLOWED_TYPES'},
            dict(json=json, uuid=uuid, time=time, datetime=datetime, timezone=timezone,
                 s3=s3, photos_table=table, BUCKET_NAME='bucket'))
        for mime, size, expected in [('video/mp4',200*1024**2,200),('video/quicktime',100*1024**2,200),('image/jpeg',20*1024**2,20)]:
            result=env['handler']({'body':json.dumps(dict(contentType=mime,fileSize=size))},None)
            self.assertEqual(result['statusCode'],200)
            self.assertIn(['content-length-range',1,expected*1024**2],s3.generate_presigned_post.call_args.kwargs['Conditions'])
        for mime,size in [('video/mp4',200*1024**2+1),('image/jpeg',20*1024**2+1),('video/webm',100),('video/mp4',True)]:
            self.assertEqual(env['handler']({'body':json.dumps(dict(contentType=mime,fileSize=size))},None)['statusCode'],400)

    def test_video_bypasses_image_download_and_preserves_metadata(self):
        s3, table = Mock(), Mock()
        s3.head_object.return_value=dict(ContentLength=100*1024**2,ContentType='video/mp4')
        env=load_functions('backend/functions/finalize_upload/lambda_function.py',{'process_photo','process_video'},
            dict(s3=s3,photos_table=table,BUCKET_NAME='bucket',datetime=datetime,timezone=timezone))
        env['process_photo']('id','uploads/id.mp4',100*1024**2)
        s3.get_object.assert_not_called()
        s3.put_object.assert_not_called()
        args=table.update_item.call_args.kwargs
        self.assertEqual(args['ExpressionAttributeValues'][':ready'],'READY')
        self.assertIn('REMOVE expires_at',args['UpdateExpression'])
        self.assertIn('declared_size = :size',args['ConditionExpression'])
        s3.head_object.return_value['ContentLength']=201*1024**2
        with self.assertRaises(ValueError):env['process_video']('id','uploads/id.mp4',201*1024**2)

if __name__ == '__main__': unittest.main()
