---
title: Notes on Setting Up a Raspberry Pi
date: 2020-06-14T17:58:30-07:00
lastmod: 2020-06-21
tags:
  - notes
  - raspberrypi
---

{{< lead >}}
My personal notes on how to get a new Raspberry Pi ready for action. Written for a Mac, but the general steps should translate to any platform.
{{< /lead >}}

<!--more-->

## Download the OS image

Start by [downloading the official Raspberry Pi OS (32-bit) Lite image](https://www.raspberrypi.org/downloads/raspberry-pi-os/). For this example, it was `2020-05-27-raspios-buster-lite-armhf.zip`.

Be sure to verify the checksum:

```console
$ shasum -a 256 2020-05-27-raspios-buster-lite-armhf.zip
f5786604be4b41e292c5b3c711e2efa64b25a5b51869ea8313d58da0b46afc64  2020-05-27-raspios-buster-lite-armhf.zip
```

Decompress & clean up:

```console
$ unzip 2020-05-27-raspios-buster-lite-armhf.zip
Archive:  2020-05-27-raspios-buster-lite-armhf.zip
  inflating: 2020-05-27-raspios-buster-lite-armhf.img
$ rm 2020-05-27-raspios-buster-lite-armhf.zip
$
```

## Burn to a micro SD card

Use [Etcher](https://www.balena.io/etcher/).

To install, if you haven't already:

```console
brew cask install balenaetcher
```

## Configure via `boot` partition

It's FAT32, so totally mountable on MacOS. Should automatically mount to `/Volumes/boot`. If it mounts as read-only, make sure the little physical switch on the adapter didn't get bumped on the way in.

### Enable SSH

```console
touch /Volumes/boot/ssh
```

### WiFi

Add your wifi info:

```console
vim /Volumes/boot/wpa_supplicant.conf
```

Here's a handy template:

```ini
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=US

network={
  ssid="YOUR_SSID"
  psk="YOUR_PASSPHRASE"
}
```

### Unmount

Finally, unmount the card:

```console
diskutil unmount /Volumes/boot
```

## Configure the machine

Put the SD card in the pi and boot it up. After a little while, try SSHing into it:

```console
ssh pi@raspberrypi.local
```

The default password is "raspberry".

### Run `raspi-config`

```console
sudo raspi-config
```

Be sure to:

1. Change password
2. Set hostname
3. Switch locale from `en_GB.UTF-8` to `en_US.UTF-8`
4. Set timezone
5. Disable the Camera and VNC
6. (For headless) Reduce GPU memory split to 16MB

### Add your SSH public key

Get your SSH public key from your workstation:

```console
cat ~/.ssh/id_rsa.pub | pbcopy
```

And add it to the pi (in the SSH session):

```console
mkdir ~/.ssh
nano ~/.ssh/authorized_keys
```

(Paste & save)

### Deactivate password authentication

```console
sudo sed -i '/^#PasswordAuthentication yes/cPasswordAuthentication no' /etc/ssh/sshd_config
```

### Reboot

```console
sudo reboot
```

Then SSH back in (using your new hostname). As long as you've done `ssh-add` already, it should connect up no problem.

## Apply Updates

Even if you pulled a fresh image, there's surely something that's been updated since.

Update package info:

```console
sudo apt update
```

Upgrade anything new:

```console
sudo apt full-upgrade
```

Clean up anything that can be autoremoved:

```console
sudo apt autoremove
```

## Clean Up

Delete the "known" host for `raspberrypi.local`, or else it will issue an alarming security error the next time you're setting up another Raspberry Pi:

```console
vim ~/.ssh/known_hosts
```
