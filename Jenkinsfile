
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Environment') {
            steps {
                bat 'node --version'
                bat 'call npm.cmd --version'
                bat 'git --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'call npm.cmd ci'
            }
        }

        stage('Install Playwright Browser') {
            steps {
                bat 'call npx.cmd playwright install chromium'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'call npx.cmd playwright test --project=Chromium'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**,test-results/**',
                             allowEmptyArchive: true
        }

        success {
            echo 'Playwright tests completed successfully.'
        }

        failure {
            echo 'Playwright tests failed. Check the Jenkins console output and artifacts.'
        }
    }
}
