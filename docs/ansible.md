# Ansible : les notions à connaître

Ansible se connecte en **SSH** à des machines et leur applique un **état voulu**. Aucun agent à installer sur les machines.

| Notion | Rôle | Dans ce dépôt |
| --- | --- | --- |
| **Inventaire** | Liste des machines et des groupes | `ansible/inventory/hosts.ini` (groupe `k3s`) |
| **Playbook** | Fichier YAML qui associe des machines à des tâches ou des rôles | `playbooks/site.yml` |
| **Rôle** | Ensemble réutilisable (tâches, handlers, variables) | `roles/common`, `roles/k3s` |
| **Tâche / module** | Une action (`apt`, `lineinfile`, `ufw`, `service`) | dans `roles/*/tasks/main.yml` |
| **Handler** | Tâche qui ne s'exécute que si une autre a *changé* quelque chose | `Redémarrer ssh` |
| **Variables** | Valeurs paramétrables | `group_vars/k3s/vars.yml`, `roles/*/defaults` |
| **Idempotence** | Rejouer ne change rien si l'état est déjà conforme | le champ `changed` du récapitulatif vaut 0 |
| **Vault** | Chiffrement des secrets | voir ci-dessous |

## Commandes de base

```bash
cd ansible
ansible all -m ping                                  # la machine répond-elle ?
ansible-playbook playbooks/site.yml --syntax-check   # vérifier la syntaxe
ansible-playbook playbooks/site.yml --check --diff   # simulation : montre ce qui changerait
ansible-playbook playbooks/site.yml                  # appliquer
ansible-playbook playbooks/site.yml --tags k3s       # seulement le rôle k3s
```

## Tester l'idempotence

Lance le playbook deux fois. La première fois, le récapitulatif de fin montre plusieurs `changed`. La seconde fois, il doit montrer `changed=0` : c'est la preuve que le playbook décrit un **état**, pas une suite de commandes.

## Ansible Vault (secrets)

```bash
ansible-vault create group_vars/k3s/vault.yml     # crée un fichier chiffré (saisir un mot de passe)
ansible-vault edit group_vars/k3s/vault.yml
ansible-playbook playbooks/site.yml --ask-vault-pass
```

Le fichier `vault.yml` est ignoré par Git dans ce dépôt ; en entreprise, on peut le versionner chiffré.

## Terraform ou Ansible ?

Terraform **crée** l'infrastructure (VM, réseau) de façon déclarative, avec un state. Ansible **configure** ce qu'il y a dedans (paquets, fichiers, services) et orchestre. Ils se complètent.
