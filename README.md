# todo-app-frontend

## 目次

-   [環境構築](#setup-env)
-   [開発サーバーの起動](#start-dev)
-   [ローカルコンテナでの起動](#start-container)
-   [Google Cloud CLI の設定](#setup-gcp-cli)
-   [GitHub CLI の設定](#setup-github-cli)
-   [GCP プロジェクトの作成](#create-gcp-project)
-   [GitHub Secrets の設定](#setup-github-secrets)

<h2 id="setup-env">環境構築</h2>

```sh
$ yarn install
```

<h2 id="start-dev">開発サーバーの起動</h2>

```sh
$ yarn start
```

<h2 id="start-container">ローカルコンテナでの起動</h2>

```sh
$ docker comopse up -d
```

<h2 id="setup-gcp-cli">Google Cloud CLI の設定</h2>

```sh
$ docker pull google/cloud-sdk:latest
$ docker run -ti google/cloud-sdk:latest gcloud version
$ docker run -ti --name gcloud-config google/cloud-sdk gcloud auth login
$ alias gcloud='docker run --rm -it --volumes-from gcloud-config google/cloud-sdk gcloud'
```

#### 請求先アカウント ID の確認

```sh
$ gcloud billing accounts list
```

<h2 id="setup-github-cli">GitHub CLI の設定</h2>

```sh
$ brew install gh
# 下記のコマンドは任意。自分の環境ではなぜか unset GITHUB_TOKEN をしてもエラーが出るのでエイリアスを追加した。
$ alias gh='env -u GITHUB_TOKEN gh'
$ gh auth login
```

<h2 id="create-gcp-project">GCP プロジェクトの作成</h2>

```sh
$ gcloud projects create ${PROJECT_ID} --name ${PROJECT_NAME}
$ gcloud config set project ${PROJECT_ID}
$ gcloud billing projects link ${PROJECT_ID} --billing-account ${BILLING_ACCOUNT_ID}
$ gcloud services enable iamcredentials.googleapis.com run.googleapis.com compute.googleapis.com
$ gcloud config set compute/region asia-northeast1
$ gcloud config set compute/zone asia-northeast1-a
$ gcloud iam service-accounts create ${SERVICE_ACCOUNT_ID} --display-name ${SERVICE_ACCOUNT_NAME}
$ gcloud iam workload-identity-pools create ${POOL_NAME} --location=global
$ export WORKLOAD_IDENTITY_POOL_ID=$(gcloud iam workload-identity-pools describe ${POOL_NAME} --project=${PROJECT_ID} --location=global --format="value(name)")
$ gcloud iam workload-identity-pools providers create-oidc ${PROVIDER_NAME} \
    --location=global \
    --workload-identity-pool=${POOL_NAME} \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor,attribute.aud=assertion.aud" \
    --issuer-uri=https://token.actions.githubusercontent.com
$ gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com \
    --role=roles/iam.workloadIdentityUser \
    --member=principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${GITHUB_REPO}
$ gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/run.admin"
$ gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/storage.admin"
$ gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
$ export WORKLOAD_IDENTITY_PROVIDER_ID=$(gcloud iam workload-identity-pools providers describe ${PROVIDER_NAME} \
    --project=${PROJECT_ID} \
    --location=global \
    --workload-identity-pool=${POOL_NAME} \
    --format="value(name)")
```

> [!NOTE]
> すでに [ShintaroaSuzuki/todo-app-backend](https://github.com/ShintaroaSuzuki/todo-app-backend) で環境構築されている場合は、サービスアカウントにロールを追加するのみでよい
>
> ```sh
> $ export WORKLOAD_IDENTITY_POOL_ID=$(gcloud iam workload-identity-pools describe ${POOL_NAME} --project=${PROJECT_ID} --location=global --format="value(name)")
> $ gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com \
>     --role=roles/iam.workloadIdentityUser \
>     --member=principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${GITHUB_REPO}
> $ export WORKLOAD_IDENTITY_PROVIDER_ID=$(gcloud iam workload-identity-pools providers describe ${PROVIDER_NAME} \
>     --project=${PROJECT_ID} \
>     --location=global \
>     --workload-identity-pool=${POOL_NAME} \
>     --format="value(name)")
> ```

> [!WARNING]
> ${GITHUB_REPO} は大文字小文字の区別があるので注意
>
> そもそもアカウント名やリポジトリ名に大文字を使うべきではないが

<h2 id="setup-github-secrets">GitHub Secrets の設定</h2>

```sh
$ gh secret set GCP_PROJECT_ID --body ${PROJECT_ID}
$ gh secret set SERVICE_ACCOUNT_ID --body ${SERVICE_ACCOUNT_ID}
$ gh secret set WORKLOAD_IDENTITY_PROVIDER_ID --body ${WORKLOAD_IDENTITY_PROVIDER_ID}
$ gh secret set REACT_APP_API_URL --body ${REACT_APP_API_URL}

# 環境変数を削除
$ unset WORKLOAD_IDENTITY_POOL_ID
$ unset WORKLOAD_IDENTITY_PROVIDER_ID
```
