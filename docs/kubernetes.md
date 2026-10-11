# Kubernetes : les notions à connaître

| Objet | Rôle | Dans ce dépôt |
| --- | --- | --- |
| **Pod** | Plus petite unité : un ou plusieurs conteneurs | créés par le Deployment |
| **Deployment** | Maintient N pods identiques, gère les mises à jour | `k8s/base/deployment.yaml` (2 réplicas) |
| **ReplicaSet** | Créé par le Deployment : garantit le nombre de pods | automatique |
| **Service** | Adresse stable et répartition de charge vers les pods | `service.yaml` (ClusterIP) |
| **Ingress** | Règle HTTP d'entrée depuis l'extérieur (via Traefik dans k3s) | `overlays/vm/ingress.yaml` |
| **ConfigMap** | Configuration non sensible | `configmap.yaml` |
| **Secret** | Valeurs sensibles (encodées en base64, **pas** chiffrées par défaut) | non utilisé ici |
| **Namespace** | Espace de noms qui sépare des ressources | `demo` |
| **Probes** | `readiness` (reçoit du trafic ?) et `liveness` (faut-il redémarrer ?) | sur `/health` |
| **Requests / limits** | Ressources réservées / plafonnées | CPU 50m→250m, mémoire 64→128 Mi |
| **Kustomize** | Assemble une base et des variantes (overlays) | `k8s/overlays/*` |

## Commandes de diagnostic

```bash
kubectl get pods -n demo -o wide
kubectl describe pod <pod> -n demo         # la section Events explique presque tout
kubectl logs <pod> -n demo                 # logs actuels
kubectl logs <pod> -n demo --previous      # logs du conteneur précédent (après un crash)
kubectl get events -n demo --sort-by=.lastTimestamp
kubectl rollout status deployment/webapp -n demo
kubectl rollout history deployment/webapp -n demo
kubectl rollout undo deployment/webapp -n demo     # retour arrière
kubectl scale deployment/webapp -n demo --replicas=4
kubectl top pods -n demo                   # nécessite metrics-server (inclus dans k3s)
kubectl port-forward svc/webapp 8080:80 -n demo
```

## États de pod fréquents

| Statut | Signification probable | Où regarder |
| --- | --- | --- |
| `ImagePullBackOff` / `ErrImagePull` | Image introuvable ou privée | `describe pod` > Events |
| `CrashLoopBackOff` | Le conteneur démarre puis plante en boucle | `logs --previous` |
| `Pending` | Pas de nœud avec assez de ressources | `describe pod` > Events |
| `Running` mais `0/1 READY` | La sonde readiness échoue | `describe pod`, route `/health` |
| `OOMKilled` | Dépassement de la limite mémoire | `describe pod` > Last State |
