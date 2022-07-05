#!/bin/sh
# ideas used from https://gist.github.com/motemen/8595451

# Based on https://github.com/eldarlabs/ghpages-deploy-script/blob/master/scripts/deploy-ghpages.sh
# Used with their MIT license https://github.com/eldarlabs/ghpages-deploy-script/blob/master/LICENSE

# show where we are on the machine
pwd
remote=$(git config remote.origin.url)
# make a directory to put the gp-pages branch
mkdir -p gh-pages-branch
cd gh-pages-branch

{ # try
  # now let's setup a new repo so we can update the gh-pages branch
  # git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
  # git config --global user.name "$GH_NAME" > /dev/null 2>&1

  git init
  git remote add --fetch origin "$remote"

  # switch into the the gh-pages branch
  if git rev-parse --verify origin/gh-pages > /dev/null 2>&1;
  then
    git checkout gh-pages
    # delete any old site as we are going to replace it
    # Note: this explodes if there aren't any, so moving it here for now
    git rm -rf .
  else
    git checkout --orphan gh-pages
  fi

  # copy over or recompile the new site
  cp -RTa "../out" .

  # reset CNAME record since we removed all the things
  # echo esdoc2.org > CNAME

  # stage any changes and new files
  git add -A
  # commit, ignoring branch gh-pages doesn't seem to work, so trying skip
  git commit --allow-empty -m "Deploy to GitHub pages [ci skip]"
  # push, but send output to /dev/null to hide anything sensitive
  git push --force --quiet origin gh-pages
  # go back to where we started and remove the gh-pages git
  # repo we made and used for deployment
  cd ..
  rm -rf gh-pages-branch
} || { # catch
  cd ..
  rm -rf gh-pages-branch
  exit 1
}

echo "Finished Deployment!"
