podTemplate( //idleMinutes: 15, 
    yaml: '''
apiVersion: v1
kind: Pod
metadata:
  namespace: jenkins
spec:
  volumes:
    - name: docker-insecure-registries
      configMap:
        name: harbor-allow-insecure-registries
        items:
          - key: daemon.json
            path: daemon.json
    - name: cache
      hostPath:
        path: /tmp
        type: Directory
  serviceAccountName: jenkins-sa
  containers:
  - name: docker
    image: docker:19.03.1-dind
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    volumeMounts:
    - name: cache
      mountPath: /var/lib/docker
    - name: docker-insecure-registries
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
''') {
    node(POD_LABEL) {
        stage("GIT") {
          git credentialsId: 'github-cred', url: 'https://github.com/alinahid477/VMW.git'
        }

        stage("DOCKER") {
          container('docker') {
            withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
              sh """ 
                  docker login -u ${USERNAME} -p ${PASSWORD} &&
                  docker build -t 1.2.3.4/calc/calcfrontend:latest .
                  docker logout
              """    
                
            }
            withCredentials([usernamePassword(credentialsId: 'harbor-cred', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
              sh """
                  docker login -u ${USERNAME} -p ${PASSWORD} 1.2.3.4 &&
                  docker push 1.2.3.4/calc/calcfrontend:latest
              """
            }
          }
        }
        
        stage("K8S") {
          withKubeConfig([credentialsId: 'jenkins-robot-token',
                      serverUrl: 'https://10.xxx.xxx.67:6443',
                      clusterName: 'calc-k8-cluster',
                      namespace: 'calculator'
                      ]) {
            sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"'
            sh 'ls -la'
            sh 'chmod 777 ./kubectl'
            sh './kubectl apply -f kubernetes/deployment.yaml'
          }
        }
                
        
    }
}
