pipeline {
    agent any

    stages {
        stage('Dependencies (BE)') {
            steps {
                nodejs('node-14.17.1') {
                    sh 'npm ci'
                }
            }
        }

        stage('Build (BE)') {
            steps {
                nodejs('node-14.17.1') {
                    sh 'npm run build'
                }
            }
        }

        stage('Dependencies (FE)') {
            steps {
                dir('angular') {
                    nodejs('node-14.17.1') {
                        sh 'npm ci'
                    }
                }
            }
        }

        stage('Build (FE)') {
            steps {
                dir('angular') {
                    nodejs('node-14.17.1') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'rm -rf /dist/easyrepay/*'
                sh 'cp -r node_modules /dist/easyrepay/node_modules'
                sh 'cp -r dist/* /dist/easyrepay/'
                sh 'cp -r api /dist/easyrepay/'
                sh 'cp pm2.config.js /dist/easyrepay/'
                sh 'cp package.json /dist/easyrepay/'
                sh 'cp package-lock.json /dist/easyrepay/'
            }
        }

        stage('Environment') {
            steps {
                sh 'rm /dist/easyrepay/.env'
                sh 'echo NODE_ENV=production >> /dist/easyrepay/.env'
                sh 'echo DATABASE_URL=postgresql://easyrepay:easyrepay@database:5432/easyrepay >> /dist/easyrepay/.env'
                sh 'echo SECRET_KEY=$EASYREPAY_SECRET_KEY >> /dist/easyrepay/.env'
                sh 'echo GIT_BRANCH=$GIT_BRANCH >> /dist/easyrepay/.env'
                sh 'echo GIT_COMMIT=$GIT_COMMIT >> /dist/easyrepay/.env'
                sh 'echo RELEASE_DATE=$(date "+%Y-%m-%d %H:%M:%S") >> /dist/easyrepay/.env'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
