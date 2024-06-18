<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/monadex-labs/monadexp-discord-bot">
    <img src="./src/assets/monadexLogo.png" alt="Logo" width="80">
  </a>

  <h3 align="center">MonadeXP Discord Bot</h3>

  <p align="center">
    Discord bot for Monadex's official XP campaign
    <br />
    <a href="https://monadex.gitbook.io/monadex/features/monadexp-campaign"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://discord.gg/gUG5fhF69D">View Demo</a>
    ·
    <a href="https://github.com/monadex-labs/monadexp-discord-bot/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/monadex-labs/monadexp-discord-bot/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

Monadex's official XP program will run in three seasons until the mainnet launch. MXP can be earned by actively engaging the community, preforming tasks/quests, contributing to the project, etc. After launch, MXP will be converted to $MDX (Monadex's governance token) at a ratio which will be decided later on. You can learn more about the XP program [here](https://monadex.gitbook.io/monadex/features/monadexp-campaign).

With the help of the discord bot, users can track their MXP balances, gift MXP to others, check the leaderboard, and use the bank to earn interest. The bot has some admin exclusive commands for allocating MXP or penalising users for suspicious acts.


### Built With

- ![JavaScript][javascript-url]
- ![Discord.js](https://img.shields.io/badge/-DISCORD.JS-%235865F2.svg?style=for-the-badge)
- ![npm][npm-url]


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Ensure that you have git and node.js installed and configured on your system. 

### Installation

Clone the repo and cd into it

```shell
git clone https://github.com/monadex-labs/monadexp-discord-bot
cd monadexp-discord-bot
```

Install the project's dependencies

```shell
npm install .
```

Fill in all the necessary fields in the `.env.example` and rename it to `.env`. Then run the following command to start the bot on your server

```shell
npm run bot
```

That's it, you should be ready to go now.


<!-- USAGE EXAMPLES -->
## Usage

In any of the Monadex's official discord channels, you can use `/help` to learn about the bot and the commands accessible to you.


<!-- ROADMAP -->
## Roadmap

- [x] Setup repo
- [x] Add slash commands
  - [x] Add admin commands
  - [x] Add user commands
  - [x] Add a bank system to earn interest on MXP
- [x] Add a good README.md

See the [open issues](https://github.com/monadex-labs/monadexp-discord-bot/issues) for a full list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- CONTACT -->
## Contact

Here's a gateway to Monadex's socials

[![Linktree](https://img.shields.io/badge/linktree-1de9b6?style=for-the-badge&logo=linktree&logoColor=white)](https://linktr.ee/Monadex)


<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/monadex-labs/monadexp-discord-bot.svg?style=for-the-badge
[contributors-url]: https://github.com/monadex-labs/monadexp-discord-bot/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/monadex-labs/monadexp-discord-bot.svg?style=for-the-badge
[forks-url]: https://github.com/monadex-labs/monadexp-discord-bot/network/members
[stars-shield]: https://img.shields.io/github/stars/monadex-labs/monadexp-discord-bot.svg?style=for-the-badge
[stars-url]: https://github.com/monadex-labs/monadexp-discord-bot/stargazers
[issues-shield]: https://img.shields.io/github/issues/monadex-labs/monadexp-discord-bot.svg?style=for-the-badge
[issues-url]: https://github.com/monadex-labs/monadexp-discord-bot/issues
[license-shield]: https://img.shields.io/github/license/monadex-labs/monadexp-discord-bot.svg?style=for-the-badge
[license-url]: https://github.com/monadex-labs/monadexp-discord-bot/blob/master/LICENSE.txt
[javascript-url]: https://img.shields.io/badge/Javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[npm-url]: https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white&style=for-the-badge
[linktree-url]: https://linktr.ee/