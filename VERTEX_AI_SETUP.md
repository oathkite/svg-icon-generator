# Vertex AI Imagen 4.0 セットアップガイド

## 1. Google Cloud プロジェクトの設定

### プロジェクト作成
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを使用）
3. プロジェクトIDをメモしておく

### 必要なAPIの有効化
```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
```

## 2. 認証の設定

### サービスアカウントの作成
1. IAM > サービスアカウント に移動
2. 「サービスアカウントを作成」をクリック
3. 以下の役割を付与：
   - Vertex AI User
   - AI Platform Developer

### 認証キーの作成
1. 作成したサービスアカウントを選択
2. 「キー」タブ > 「キーを追加」 > 「新しいキーを作成」
3. JSON形式を選択してダウンロード
4. ダウンロードしたファイルを安全な場所に保存

## 3. 環境変数の設定

`.env.local` ファイルを更新：

```bash
# Google Cloud Vertex AI Configuration
GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
VERTEX_AI_LOCATION=us-central1
```

### または、gcloud CLIを使用した認証
```bash
gcloud auth application-default login
```

## 4. 利用可能な地域

Imagen 4.0が利用可能な地域：
- us-central1
- us-east4
- us-west1
- europe-west4
- asia-southeast1

## 5. コスト情報

- Imagen 4.0: 画像1枚あたり約$0.08-0.12
- 1024x1024解像度での生成

## 6. トラブルシューティング

### 認証エラー
```bash
# gcloud設定の確認
gcloud config list

# プロジェクトの設定
gcloud config set project YOUR_PROJECT_ID

# 認証の確認
gcloud auth list
```

### APIアクセスエラー
1. Vertex AI APIが有効になっているか確認
2. サービスアカウントに適切な権限があるか確認
3. 使用している地域でImagen 4.0が利用可能か確認

## 7. 実装の詳細

本アプリケーションでは以下の流れでアイコンを生成します：

1. **Iconifyライブラリ検索** (最高品質)
2. **事前定義パターン** (高品質)
3. **Vertex AI Imagen 4.0** (画像生成 → SVG変換)
4. **OpenAI GPT-4** (最終手段)

Vertex AI生成では：
- プロンプトを英語に最適化
- ミニマルなアイコンスタイルを指定
- 生成画像をPotrace経由でSVGに変換
- 24x24 viewBoxに正規化