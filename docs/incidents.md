# Incidents à rejouer (partie « Run »)

Pour chaque scénario : **provoquer, observer, diagnostiquer, corriger**. Note ce que tu vois : c'est la matière de ton récit en entretien.

## 1. Image introuvable (`ImagePullBackOff`)

- **Provoquer** : `kubectl set image deployment/webapp webapp=webapp:inexistante -n demo`
- **Observer** : `kubectl get pods -n demo` montre les anciens pods toujours `Running` (la mise à jour progressive protège le service) et un nouveau pod en `ErrImagePull`.
- **Diagnostiquer** : `kubectl describe pod <nouveau-pod> -n demo` > Events.
- **Corriger** : `kubectl rollout undo deployment/webapp -n demo`
- **À retenir** : grâce à `maxUnavailable: 0`, le service n'a jamais été interrompu.

## 2. Sonde de santé en échec

- **Provoquer** : change le chemin de la sonde readiness en `/n-existe-pas` (`kubectl edit deployment webapp -n demo`).
- **Observer** : les nouveaux pods restent `0/1 READY` ; le trafic continue d'aller aux anciens.
- **Diagnostiquer** : `describe pod` affiche `Readiness probe failed: HTTP probe failed with statuscode: 404`.
- **Corriger** : remettre `/health` ou `rollout undo`.

## 3. Crash en boucle (`CrashLoopBackOff`)

- **Provoquer** : change la commande du conteneur (`command: ["node", "src/introuvable.js"]`).
- **Observer** : le statut passe à `CrashLoopBackOff`, le nombre de `RESTARTS` augmente.
- **Diagnostiquer** : `kubectl logs <pod> -n demo --previous` affiche `Cannot find module`.
- **Corriger** : annuler la modification.

## 4. Dépassement de mémoire (`OOMKilled`)

- **Provoquer** : mets `limits.memory: 8Mi`.
- **Diagnostiquer** : `describe pod` > Last State : `OOMKilled`, exit code 137.
- **Corriger** : relever la limite.

## 5. Pic d'erreurs applicatives

- **Provoquer** : `for i in $(seq 20); do curl -s http://<ip>/api/fail; done`
- **Diagnostiquer** : `kubectl logs -l app=webapp -n demo --tail=50` (les logs sont en JSON, une ligne par requête).

## 6. Mise à l'échelle et mise à jour

- `kubectl scale deployment/webapp -n demo --replicas=5`, puis observer `kubectl get pods -w`.
- Change `APP_VERSION` dans le ConfigMap, `kubectl rollout restart deployment/webapp -n demo`, suis `kubectl rollout status`.

## 7. Côté Ansible

- **Dérive** : connecte-toi en SSH à la VM, désactive `fail2ban` (`sudo systemctl stop fail2ban`), puis relance le playbook : Ansible le remet en état et le récapitulatif affiche `changed=1`.
- **Simulation** : `ansible-playbook playbooks/site.yml --check --diff`.
