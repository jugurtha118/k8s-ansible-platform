# k8s-ansible-platform

Projet d'entraînement **Cloud / DevOps** : une application conteneurisée déployée sur un cluster **Kubernetes (k3s)**, installé et durci par **Ansible** sur une VM Azure créée par **Terraform**.

```
Terraform ──crée──> VM Azure Ubuntu (réseau, NSG, IP, arrêt automatique)
Ansible   ──configure──> durcissement SSH, pare-feu, fail2ban, installation de k3s
Kubernetes (k3s) ──fait tourner──> l'application (2 réplicas, sondes, limites, Ingress)
GitHub Actions ──vérifie──> tests, ansible-lint, terraform validate, build de l'image (GHCR)
```

## Structure

| Dossier | Contenu |
| --- | --- |
| `app/` | Application Node.js + `Dockerfile` (image non-root) |
| `k8s/base` | Manifests : Namespace, ConfigMap, Deployment, Service |
| `k8s/overlays/local` | Variante pour un cluster local (kind) |
| `k8s/overlays/vm` | Variante pour k3s sur la VM (image GHCR + Ingress) |
| `ansible/` | `ansible.cfg`, inventaire, playbook `site.yml`, rôles `common` et `k3s` |
| `terraform/` | VM Azure Ubuntu 24.04, réseau, NSG, IP publique, arrêt automatique |
| `docs/` | Notes Ansible, notes Kubernetes, incidents à rejouer, fiche entretien |

## Parcours (dans cet ordre)

1. **Docker** : construire l'image et la lancer en local.
2. **Kubernetes local (kind)** : déployer avec `kubectl apply -k k8s/overlays/local`, tester sondes, mise à l'échelle, mise à jour, retour arrière.
3. **Terraform** : créer la VM Azure.
4. **Ansible** : configurer la VM et installer k3s (relancer le playbook : la 2e exécution ne change rien).
5. **Kubernetes sur la VM** : tunnel SSH, déploiement avec l'overlay `vm`, test depuis Internet.
6. **Incidents** : `CrashLoopBackOff`, image introuvable, sonde en échec (voir `docs/incidents.md`).
7. **Nettoyage** : `terraform destroy` (la VM coûte quelques centimes par heure).

## Coût

VM `Standard_B2s` : quelques centimes de l'heure, arrêtée chaque soir à 23 h. `terraform destroy` en fin de session supprime tout (resource group compris).

## Ce que ce dépôt ne fait pas (honnêtement)

Cluster à un seul nœud (pas de haute disponibilité), State Terraform local, pas de TLS ni de domaine, pas de supervision Kubernetes. Ce sont des évolutions naturelles : AKS, state distant, cert-manager, Prometheus/Grafana.

## Licence

MIT
