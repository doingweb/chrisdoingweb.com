#!/usr/bin/env bash

export GIT_COMMIT_SHA=`git rev-parse --verify HEAD`
export GIT_COMMIT_SHA_SHORT=`git rev-parse --short HEAD`

hugo --gc --minify "$@"
