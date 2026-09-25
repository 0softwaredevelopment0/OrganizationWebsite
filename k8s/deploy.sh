#!/bin/bash
set -e

echo "=== rizer001-site deploy ==="

# kubectl runs under sudo; root has no kubeconfig, reuse the admin user's
export KUBECONFIG="${KUBECONFIG:-/home/user/.kube/config}"

# 1. Build image
echo "[1/6] Building image..."
cd /opt/websites/rizer001-site
nerdctl build -t rizer001-site:latest .

# 2. Import into K8s containerd (if needed)
echo "[2/6] Importing image into K8s..."
nerdctl save rizer001-site:latest | ctr -n k8s.io images import -

# 3. Apply K8s manifests
echo "[3/6] Applying manifests..."
kubectl apply -f /opt/websites/rizer001-site/k8s/namespace.yaml
kubectl apply -f /opt/websites/rizer001-site/k8s/secret.yaml
kubectl apply -f /opt/websites/rizer001-site/k8s/clusterissuer.yaml
kubectl apply -f /opt/websites/rizer001-site/k8s/service.yaml
kubectl apply -f /opt/websites/rizer001-site/k8s/statefulset.yaml
kubectl apply -f /opt/websites/rizer001-site/k8s/ingress.yaml

# 4. Wait for rollout (restart needed when image tag is unchanged)
kubectl -n rizer001-site rollout restart statefulset/rizer001-site
echo "[4/6] Waiting for StatefulSet rollout..."
kubectl rollout status statefulset/rizer001-site -n rizer001-site --timeout=120s

# 5. Init database (run prisma db push on first pod)
echo "[5/6] Initializing database..."
POD=$(kubectl get pod -n rizer001-site -l app=rizer001-site -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n rizer001-site $POD -- npx prisma db push --skip-generate 2>/dev/null || echo "DB already initialized or prisma not in PATH"

# 6. Verify
echo "[6/6] Verifying..."
kubectl get pods -n rizer001-site
kubectl get svc -n rizer001-site
kubectl get ingress -n rizer001-site
echo ""
echo "=== Deploy complete ==="
echo "URL: https://rizer001.opik.net"
echo "Check cert: kubectl get certificate -n rizer001-site"
