!slide

# Installing Drupal with Ansible

Josh Finnie

!slide

## Who am I

* Josh Finnie 
* Application Developer @ [Koansys](http://koansys.com)
* Supporting [NASA Science](http://science.nasa.gov/)

!slide

## The Project
* To convert NASA Science's CMS
* Currently is Django (with Fein CMS)
* Moving to Drupal 7

!slide

## Gotcha

!['Cloud'](images/cloud.jpg)

**THE CLOUD!**

!slide

## The Cloud

* Amazon Web Services
    * EC2
    * (Hopefully) S3
    * Cloudfront
    * ect...
* Need a way to keep persist instances.
* Can do very little "hands-on" work.

!slide

## Enter Ansible

>Ansible is an IT automation tool. It can configure systems, deploy software,
and orchestrate more advanced IT tasks such as continuous deployments or zero
downtime rolling updates. [http://docs.ansible.com/]

* Kind of like [Puppet](http://docs.puppetlabs.com/) or [Chef](http://docs.opscode.com/)

!slide

## But What is Ansible

* Not *really* like Puppet or Chef
* Much, much simpler...

!slide

## Reasons for Ansible

* Easy automation
* Repeatable workflow.
* Hands-off Installation

This allows "cloud-scale"

!slide

## Installing Ansible

```bash
$ which python pip
python is /usr/bin/python
pip is /usr/bin/pip
```

```bash
$ pip install ansible
```

That's it!

!slide

## Using Ansible

* Ansible uses configurations called `Playbooks`
* They are written in [YAML](http://www.yaml.org/)

> Playbooks are Ansible’s configuration, deployment, and orchestration language.

* Playbooks use `Roles`
    * The basic building blocks of Ansible.


!slide

## Using Ansible (Con't)

Create Playbooks & Roles for each different machine type:
* Webservers
* MongoDB
* Hadoop
* Gluster (Brick & Clients)
* etc...

More Examples [here](https://github.com/ansible/ansible-examples).



!slide

## Automating Drupal

* For Drupal, we have some Roles needed:
    * A LAMP stack
    * Drupal itself
    * Modules using `drush`

!slide

## Science@NASA Specifics

We're using Ansible to install the following on Ubuntu 12.04:
* PHP5
* Apache
* Drupal
* Gluster
* More to come?


[Walk Through](https://github.com/koansys/drupal-ansible)


!slide

## Connect with me

* [@joshfinnie](https://twitter.com/joshfinnie) on Twitter
* [joshfinnie](https://github.com/joshfinnie) on Github
* [My Website](http://www.joshfinnie.com)

[Tonight's Slides](http://www.joshfinnie.com/talks/02-10-2014-installing-drupal-with-ansible/#/)


!slide

# Questions

# ? 


!slide

## Resources & Credits

* Ansible
    * http://www.ansible.com/home
* Koansys' Drupal Playbooks
    * https://github.com/koansys/drupal-ansible
* Stolen Cloud Image
    * http://www.publicpolicy.telefonica.com/blogs/blog/2012/11/20/making-europe-cloud-active/
