# Deploying

To deploy the bot docker image follow these steps:

1. ssh into the server (for safety, details not included)
`ssh user@server`
2. Navigate inside the repo folder
`cd monadeXP-discord-bot`
3. Build the image
`sudo docker build -t bot-image .`
4. Deploy the bot container with the new image
`sudo docker run -d --name bot --restart=always bot-image`

## Redeploying
First we will need to do some cleanup and then we rebuild the container image and process:
1. Stop and remove the container
`sudo docker stop bot`
`sudo docker container rm bot`
2. Remove the bot image
`sudo docker image rm bot-image`
3. Download any updates from the repo
`git pull`

Then follow steps 2-4 in the previous section.


## Inspect logs
Use the following command:
`sudo docker logs bot`
Add this flag for real-time updates:
`sudo docker logs -f`
