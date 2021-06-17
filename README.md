# DynamoDB学習

## 参考
* [Amazon DynamoDB for Serverless Architectures](https://www.aws.training/Details/eLearning?id=64525)
* [初めてのサーバーレスアプリケーション開発 ～DynamoDBにテーブルを作成する～](https://dev.classmethod.jp/articles/serverless-first-dynamodb/)
* [deno-lambda を使ってみる](https://qiita.com/kt3k/items/74ed7101092219140243)

## API Gateway
[devステージ](https://57nhbd2ttk.execute-api.us-east-1.amazonaws.com/dev/?person_id=002)

## 設定
### Lambdaのテストパラメータ
```json
{
  "record": {
    "person_id": "002"
  }
}
```

### メソッドリクエスト -> URL クエリ文字列パラメータ
```
person_id
```

### 統合リクエスト -> マッピングテンプレート
```json
{
    "record" : {
        "person_id" : "$input.params('person_id')"
    }
}
```
