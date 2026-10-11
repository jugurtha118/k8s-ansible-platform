# Fiche entretien : ce projet en 2 minutes

« Pour compléter mon premier projet Azure, j'ai monté une plateforme Kubernetes de bout en bout. Terraform crée une VM Ubuntu avec son réseau et un pare-feu qui n'autorise le SSH que depuis mon IP. Ansible la configure avec deux rôles : un socle de sécurité (SSH durci, pare-feu, fail2ban) et l'installation de k3s. J'ai vérifié l'idempotence en rejouant le playbook : zéro changement la seconde fois.

Sur le cluster, j'ai déployé mon application conteneurisée avec un Deployment à deux réplicas, des sondes readiness et liveness, des limites de ressources, un conteneur non-root et un Ingress. Les variantes local et VM sont gérées avec Kustomize.

Ensuite, je me suis entraîné à l'exploitation : image introuvable, sonde en échec, crash en boucle, dépassement mémoire. Pour chacun j'ai diagnostiqué avec `describe`, `logs --previous` et les événements, puis corrigé ou fait un retour arrière.

Je sais que c'est un lab à un nœud : en production, je passerais à AKS ou à un cluster à plusieurs nœuds, un state Terraform distant, du TLS et de la supervision avec Prometheus. »

## Questions probables

**Terraform ou Ansible ?** Terraform crée l'infrastructure (déclaratif, avec un state). Ansible configure et orchestre les systèmes (sans agent, en SSH). Ils se complètent.

**Qu'est-ce que l'idempotence ?** Appliquer plusieurs fois donne le même résultat : si l'état est déjà conforme, rien ne change. C'est ce qui rend l'automatisation sûre.

**Pod, Deployment, Service ?** Le pod exécute les conteneurs, le Deployment maintient N pods et gère les mises à jour, le Service donne une adresse stable et répartit la charge.

**Readiness ou liveness ?** Readiness décide si le pod reçoit du trafic ; liveness décide si Kubernetes doit le redémarrer.

**Un pod est en CrashLoopBackOff, que fais-tu ?** `kubectl describe pod` (événements, code de sortie), `kubectl logs --previous` pour l'erreur du conteneur qui a planté, puis vérification de la configuration, des variables, des limites mémoire (OOMKilled) et des dépendances.

**Comment fais-tu une mise à jour sans interruption ?** Rolling update avec `maxUnavailable: 0`, sondes readiness fiables, et `rollout undo` si la nouvelle version échoue.

**Pourquoi k3s et pas AKS ?** Pour comprendre ce qu'un service managé cache, à faible coût. En production, AKS déleguerait le plan de contrôle à Azure.

**Comment sécurises-tu la VM ?** Clé SSH uniquement, root interdit, NSG limité à mon IP, pare-feu local, fail2ban, API Kubernetes non exposée (tunnel SSH), conteneur non-root avec capacités retirées.

## Honnêteté

Dire clairement : lab à un nœud, pas de haute disponibilité, pas de production réelle. Citer ce qu'on ferait ensuite : AKS, GitOps (Flux ou Argo CD), Prometheus et Grafana, cert-manager, scan des images.
