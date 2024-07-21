# Ansible Lucid

Ansible Lucid is a web application to manage and execute Ansible playbooks with ease. Track logs, edit inventory, and customise settings from a single intuitive dashboard.

## Features

- Manage and execute Ansible playbooks
- Real-time log tracking
- Edit inventory files
- User authentication with admin capabilities
- Customise application settings

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- pm2

## Installation

To install the application locally, follow these steps:

1. **Clone the repository**:

    ```sh
    git clone <repository_url>
    cd AnsibleLucid/ansible-lucid
    ```

2. **Run the installation script**:

    This script will install all dependencies for both frontend and backend and build the project

    ```sh
    ./install.sh
    ```

## Running the Application

To start the application:

    npm run pm2:start

To stop the application:

    npm run pm2:stop

To restart the application:

    npm run pm2:restart

## Using the Application

**Running Playbooks:**
- Navigate to the Home page
- Select a playbook from the list
- Enter any extra variables and limit hosts if necessary
- Click the "Run" button to execute the playbook

**Managing Users (Admin Only):**
- Navigate to the Admin page
- Add or remove users and assign admin roles

**Viewing Logs:**
- Navigate to the Logs page
- Use the search bar to filter logs by name
- Click on a log to view its details

**Editing Inventory:**
- Navigate to the Inventory page
- Add or remove lines from the inventory file
- Save changes to update the inventory

**Managing Application Settings:**
- Navigate to the Settings page
- Update the following fields as needed:
  - **Playbook Directory**: Path to the directory containing your Ansible playbooks
  - **User**: User account that will run the playbooks
  - **Log Directory**: Path to the directory where log files will be stored
- Click "Save Settings" to apply the changes
