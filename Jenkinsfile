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
      emptyDir: {}     
    - name: cache
      hostPath:
        path: /tmp
        type: Directory
  serviceAccountName: jenkins-sa
  containers:
  - name: docker
    image: docker:20.10.7
    command:
    - sleep
    args:
    - 20m
    securityContext:
      privileged: true
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
      mountPath: /var/run          
    - name: docker-insecure-registries
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
  - name: docker-daemon
    image: docker:20.10.7-dind
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    volumeMounts:
    - name: cache
      mountPath: /var/lib/docker
    - name: docker-sock
      mountPath: /var/run          
    - name: docker-insecure-registries
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
''') {
    node(POD_LABEL) {
        stage("GIT") {
          git credentialsId: 'pvt-repo-cred', branch: 'main', url: 'https://github.com/alinahid477/vmw-calculator-frontend.git'
        }

        stage("DOCKER") {
          container('docker') {
            withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
              sh """ 
                  docker login -u ${USERNAME} -p ${PASSWORD} &&
                  DOCKER_BUILDKIT=1 docker build -t harbor-svc.haas-422.pez.vmware.com/anahid/calcfrontend:latest .
                  docker logout
              """    
                
            }
            withCredentials([usernamePassword(credentialsId: 'pvt-registry-cred', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
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
            // sh './kubectl apply -f kubernetes/deployment.yaml'
            sh './kubectl patch deployment calcfrontend-deploy -p \"{\\"spec\\": {\\"template\\": {\\"metadata\\": { \\"labels\\": {  \\"redeploy\\": \\"$(date +%s)\\"}}}}}\" -n calculator'
          }
        }
                
        
    }
}
