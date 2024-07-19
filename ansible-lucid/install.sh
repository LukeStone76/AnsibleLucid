
#!/bin/bash

# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "Node.js could not be found. Please install Node.js first."
    exit
fi

# Check for npm
if ! command -v npm &> /dev/null
then
    echo "npm could not be found. Please install npm first."
    exit
fi

echo "Installing dependencies..."
npm install
cd backend && npm install && cd ..

echo "Building the project..."
npm run build

echo "Installation complete. Use 'npm run pm2:start' to start the project in production mode."
