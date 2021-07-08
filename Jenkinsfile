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
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
        type: File        
    - name: cache
      hostPath:
        path: /tmp
        type: Directory
  serviceAccountName: jenkins-sa
  containers:
  - name: docker
    image: docker:20.10.7-dind
    securityContext:
      privileged: true
    tty: true
    resources:
      limits:
        memory: 1Gi
      requests:
        cpu: 300m
        memory: 1024Mi
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
      - name: HOME
        value: "."
    volumeMounts:
    - name: cache
      mountPath: /var/lib/docker
    - name: docker-sock
      mountPath: /var/run/docker.sock          
    - name: docker-insecure-registries
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
''') {
    node(POD_LABEL) {
        stage("GIT") {
          git credentialsId: 'github-cred', branch: 'main', url: 'https://github.com/alinahid477/vmw-calculator-frontend.git'
        }

        stage("DOCKER") {
          container('docker') {
            withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
              sh """ 
                  docker login -u ${USERNAME} -p ${PASSWORD} &&
                  docker build -t harbor-svc.haas-422.pez.vmware.com/anahid/calcfrontend:latest .
                  docker logout
              """    
                
            }
            withCredentials([usernamePassword(credentialsId: 'harbor-cred', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
              sh """
                  docker login -u ${USERNAME} -p ${PASSWORD} harbor-svc.haas-422.pez.vmware.com &&
                  docker push harbor-svc.haas-422.pez.vmware.com/anahid/calcfrontend:latest
              """
            }
          }
        }
        
        stage("K8S") {
          withKubeConfig([credentialsId: 'jenkins-robot-token',
                      serverUrl: 'https://192.168.220.7:6443',
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
