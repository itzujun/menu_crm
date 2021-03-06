#!/usr/bin/env python
import os

from app import create_app
from flask_script import Manager
from flask_uploads import UploadSet, IMAGES, configure_uploads, ALL
from flask import request, Flask, redirect, url_for, render_template

app_docker = 'docker'
app_default = 'default'

app = create_app(app_default)
photos = UploadSet('PHOTO')
configure_uploads(app, photos)

manager = Manager(app)

if __name__ == '__main__':
    # manager.run()
    app.run(debug=True, host='0.0.0.0', port=5002)
