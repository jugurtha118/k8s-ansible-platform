output "vm_public_ip" {
  description = "Adresse IP publique de la VM"
  value       = azurerm_public_ip.vm.ip_address
}

output "ssh_command" {
  description = "Commande de connexion SSH"
  value       = "ssh -i ${trimsuffix(var.ssh_public_key_path, ".pub")} ${var.admin_username}@${azurerm_public_ip.vm.ip_address}"
}

output "ansible_inventory_line" {
  description = "Ligne à mettre dans ansible/inventory/hosts.ini"
  value       = "vm ansible_host=${azurerm_public_ip.vm.ip_address} ansible_user=${var.admin_username} ansible_ssh_private_key_file=${trimsuffix(var.ssh_public_key_path, ".pub")}"
}
