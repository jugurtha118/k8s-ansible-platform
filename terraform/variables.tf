variable "subscription_id" {
  description = "ID de l'abonnement Azure"
  type        = string
}

variable "location" {
  description = "Région Azure"
  type        = string
  default     = "francecentral"
}

variable "resource_group_name" {
  description = "Resource group du lab (créé par Terraform, supprimé par terraform destroy)"
  type        = string
  default     = "rg-k8s-lab"
}

variable "vm_size" {
  description = "Taille de la VM. 2 vCPU / 4 Go conviennent bien à k3s ; essaie Standard_B2ats_v2 ou Standard_B1ms si la taille n'est pas disponible"
  type        = string
  default     = "Standard_B2s"
}

variable "admin_username" {
  description = "Utilisateur administrateur de la VM"
  type        = string
  default     = "azureuser"
}

variable "ssh_public_key_path" {
  description = "Chemin de ta clé publique SSH"
  type        = string
  default     = "~/.ssh/id_ed25519_azure.pub"
}

variable "allowed_ssh_cidr" {
  description = "Ton adresse IP publique au format x.x.x.x/32 : seule autorisée à se connecter en SSH"
  type        = string
}

variable "shutdown_time" {
  description = "Heure d'arrêt automatique quotidien (HHMM), pour limiter le coût"
  type        = string
  default     = "2300"
}

variable "shutdown_timezone" {
  description = "Fuseau horaire de l'arrêt automatique (noms Windows)"
  type        = string
  default     = "Romance Standard Time"
}

variable "tags" {
  description = "Tags communs"
  type        = map(string)
  default = {
    project = "k8s-ansible-platform"
    owner   = "jugurtha"
  }
}
