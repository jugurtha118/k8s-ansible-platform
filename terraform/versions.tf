terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
  # State local : suffisant pour un lab jetable. Pour un usage en équipe, on le
  # mettrait dans un Storage Account (voir le projet azure-cloud-platform).
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}
