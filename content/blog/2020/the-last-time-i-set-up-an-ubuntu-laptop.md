---
title: "The Last Time I Set Up an Ubuntu Laptop"
date: 2020-06-17T17:37:56-07:00
tags:
  - notes
  - ubuntu
---

A year or two ago I rebuilt an old Dell XPS 13 L321X as a development laptop. Here's the notes I took! Maybe they'll help you, maybe not.

<!--more-->

Install Chrome
--------------

There's a `.deb` available for [regular Chrome](https://www.google.com/chrome/) (as opposed to Chromium). When installed, it will also add the Google repository, for updates.

Mount flash drive to restore backups
------------------------------------

My flash drive was formatted as exFAT, which does not ship with Ubuntu. Simply [installing `exfat-fuse` and `exfat-utils`](https://itsfoss.com/mount-exfat/) made it instantly available:

```console
sudo apt install exfat-fuse exfat-utils
```

Fix click-and-drag
------------------

When attempting to copy over some files from my flash drive, I noticed I couldn't drag-and-drop with the touchpad. [Installing `xserver-xorg-input-synaptics`](https://bugs.launchpad.net/ubuntu/+source/unity-greeter/+bug/1763209) followed by a system restart fixed this.

```console
sudo apt install xserver-xorg-input-synaptics
```

Use ZSH
-------

I've become accustomed to ZSH at work and really like it. Plus, it enables the very nice [Oh My Zsh](https://ohmyz.sh/) framework. Start by installing it:

```console
sudo apt install zsh
```

Then we need to [change the login shell](https://wiki.ubuntu.com/ChangingShells):

```console
chsh -s $(which zsh)
```

To have this take effect, just log out and then back in and GNOME Terminal should pick it up.

Oh My Zsh
---------

Oh My Zsh [installs](https://ohmyz.sh/#install) (as of this writing) via a cURL command:

```console
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

This overwrites your `.zshrc` file but will make a backup of the old one for you. Just start a new terminal (or `source ~/.zshrc` or whatever) to get all the Oh My Zsh goodness.

Ctrl-* keys in zsh
------------------

I like to use `ctrl-left` and `ctrl-right` to navigate text and `ctrl-backspace` and `ctrl-delete` to delete words at a time. Oh My Zsh includes the navigation bindings, but not the "kill word" ones, which we'll need to [add ourselves](https://unix.stackexchange.com/questions/12787/zsh-kill-ctrl-backspace-ctrl-delete) in `.zshrc`:

```console
bindkey '^[[3;5~' kill-word
bindkey '^H' backward-kill-word
```

That Stack Exchange link mentions that `^H` may not work, but it worked for me 🤷‍♀️.

Syntax highlighting in `less`
-----------------------------

First, install the `source-highlight` package, which gives us the `src-hilite-lesspipe.sh` script:

```console
apt install source-highlight
```

Then set environment variables in `.zshrc`:

```console
export LESSOPEN="| /usr/share/source-highlight/src-hilite-lesspipe.sh %s"
export LESS=' -R '
```

[source](https://unix.stackexchange.com/questions/90990/less-command-and-syntax-highlighting/139787#139787)

Making the terminal a little better
-----------------------------------

### Agnoster theme

Just switching to the ["agnoster" Oh My Zsh theme](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes#agnoster) doesn't work right out of the box — we need to set up the GNOME Terminal colors and install Powerline fonts.

First, install the [Solarized color schemes](https://github.com/aruhier/gnome-terminal-colors-solarized):

```console
git clone https://github.com/Anthony25/gnome-terminal-colors-solarized.git
cd gnome-terminal-colors-solarized
./install.sh
```

Then get the [Powerline fonts](https://github.com/powerline/fonts):

```console
sudo apt install fonts-powerline
```

Now the prompt should have those nice continuous arrow things.

### Size and space

I switched to the Ubuntu Mono Regular font at 11pt, with a default terminal size of 128x30, which seems to make better use of the screen.

I also switch the cursor from Block to I-Beam, which better matches the text editing experience I'm looking for.

### Switching tabs

Under `Preferences - Shortcuts` > `Tabs`, we *cannot* simply change "Switch to Next/Previous Tab" settings to Ctrl-Tab, because [GNOME does not promote using the Tab key in keyboard shortcuts](https://askubuntu.com/questions/133384/keyboard-shortcut-gnome-terminal-ctrl-tab-and-ctrl-shift-tab-in-12-04/134632#134632) ([more discussion](https://bugzilla.gnome.org/show_bug.cgi?id=123994)). Instead, we can use `dconf-editor` (which must be installed) to make a manual change.

Under `dconf-editor`, navigate to `/org/gnome/terminal/legacy/keybindings` and find the `next-tab` and `prev-tab` settings. Configure them to override the defaults with `<Ctrl>Tab` and `<Ctrl><Shift>Tab` respectively.

Dropbox
-------

We need Dropbox to get to our KeePass database (and because it's generally handy). There are [official instructions from Dropbox](https://www.dropbox.com/help/desktop-web/linux-commands), but they're slightly incomplete. Following along from the beginning, add the Dropbox package repository source:

```console
sudo nano /etc/apt/sources.list.d/dropbox.list
```

Then get their public key from the Ubuntu keyserver, rather than `pgp.mit.edu` (it was down):

```console
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 1C61A2656FB57B7E4DE0F4C1FC918B335044912E
```

Update to fetch the repository contents:

```console
sudo apt update
```

Then install it, as well as `python-gpg`, so it can verify signatures:

```console
sudo apt install python-gpg dropbox
```

An "Update-notifier" window will open to continue the installation.

KeePass
-------

Now we're finally ready to set up KeePass:

```console
sudo apt install keepassxc
```

`pbcopy` and `pbpaste`
----------------------

It's so handy to have [commands to marshal shell I/O and the clipboard](https://superuser.com/questions/288320/whats-like-osxs-pbcopy-for-linux/288333#288333).

Add this to `.zshrc`:

```console
# Pipe to clipboard
alias pbcopy='xclip -selection clipboard'
alias pbpaste='xclip -selection clipboard -o'
```
