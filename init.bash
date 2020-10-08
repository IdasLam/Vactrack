echo -e 'Script for initing and setting configs for Vactrack\n'

configPath="./client/src/firebaseConfig.json"

function configFirebase {
    touch "$configPath"
    echo '{' >> "$configPath"

    echo
    echo "Init Firebase SDK snippet config..."
    echo -e "To guide to find your configs for your web application: https://support.google.com/firebase/answer/7015592 \n"
    echo "Please enter the following without quotes"
    read -p "Enter apiKey: " apiKey
    read -p "Enter authDomain: " authDomain
    read -p "Enter databaseURL: " databaseURL
    read -p "Enter projectId: " projectId
    read -p "Enter storageBucket: " storageBucket
    read -p "Enter messagingSenderId: " messagingSenderId
    read -p "Enter appId: " appId
    read -p "Enter measurementId: " measurementId


    echo -e "\t\"apiKey\": \"$apiKey\"," >> $configPath
    echo -e "\t\"authDomain\": \"$authDomain\"," >> $configPath
    echo -e "\t\"databaseURL\": \"$databaseURL\"," >> $configPath
    echo -e "\t\"projectId\": \"$projectId\"," >> $configPath
    echo -e "\t\"storageBucket\": \"$storageBucket\"," >> $configPath
    echo -e "\t\"messagingSenderId\": \"$messagingSenderId\"," >> $configPath
    echo -e "\t\"appId\": \"$appId\"," >> $configPath
    echo -e "\t\"measurementId\": \"$measurementId\"" >> $configPath
    echo -e "}" >> $configPath
    echo

}

if [ ! -f "$configPath" ]; then
    configFirebase
else
    read -p "Init new Firebase SDK snippet Firebase config? (y/N): " init

    if [ "$init" == "y" ]; then
        rm "$configPath"
        configFirebase
    fi

fi

emailConfig='./server/.env'

function configEmail {
    touch "$emailConfig"

    echo
    echo "This Google Account will send out reminder emails to users."

    echo "Plase make sure that the Google Account is enabled for access to less secure apps."
    echo -e "Read this guide on how to enable access: https://support.google.com/a/answer/6260879?hl=en \n"
    echo "Please enter the following without quotes"
    read -p "Enter Gmail: " gmail
    read -p "Enter password: " password


    echo -e "EMAIL=$gmail" >> $emailConfig
    echo -e "PASSWORD=$password" >> $emailConfig
}

if [ ! -f "$emailConfig" ]; then
    configEmail
else
    read -p "Init new Gmail account? (y/N): " init

    if [ "$init" == "y" ]; then
        rm "$emailConfig"
        configEmail
    fi

fi

echo
echo "Finished config for Firebase SDK snippet and Gmail account."
