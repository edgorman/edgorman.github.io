# How This Site Works

This website has a *Linux inspired* folder structure that and allows a user to navigate the file system using a GUI or terminal interface. All the functions required to perform these commands can be found in the ```/bin/``` directory. 

The Github repositories are cloned and updated automatically on each successful pull request using Github actions. Another shell scripts generates a ```JSON``` file containing the folder structure of the website, which can be found in the ```/etc/``` directory.

There is a ```/home/``` directory that contains my personal blog, and the ```/srv/www/``` directory which is where we are now! This is where my public repositories live, so feel free to go to this file's parent folder and view my other projects.

The terminal interface makes use of a library called [Jquery Terminal](https://terminal.jcubic.pl/), which manages the terminal display and input/output with the user. Originally this website was just a stand-alone terminal, but the design wasn't user friendly enough for non-technical visitors.

The *traditional* side of the website is built upon the [Bootstrap Framework](https://getbootstrap.com/) and [JQuery Library](https://jquery.com/). The repository also makes use of the [Node Package Manager](https://www.npmjs.com/) to deploy a local http server for testing and development on your local system. 