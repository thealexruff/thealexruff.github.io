#!/bin/bash

# RENAME IMAGES
# bash namertopia.sh rename 2020-springioslo

# RESIZE
# bash namertopia.sh resize 2020-springioslo


# global
tmp_dir=$(mktemp -d -t namertopia-XX)
a=1

setup_mac () {
   sudo chown -R $(whoami) $(brew --prefix)/* 
   brew install imagemagick
}

resize () { 
    echo $tmp_dir
    echo "starting resizing"
    echo "saving images to HQ directory"
    mkdir $1/HQ 
    cp -R $1/*.jpg $1/HQ
    cp -R $1/*.jpg $tmp_dir 

    # rm $1/*.jpg 
    cd $1/
    pwd
    total=`ls -l . | egrep -c '^-'`

    for i in *.jpg; do
        new=$(printf "%02d.jpg" "$a")
        echo "[$a | $total]: Resizing $i to $new"
        # convert "$new[$2x]" "$new"
        convert $i -resize 2800x2000 $new
        let a=a+1
    done
}

rename () {
    echo "starting renaming"
    
    echo "copying files to $tmp_dir"
    cp -R $1/. $tmp_dir
    rm $1/* 
    cd $tmp_dir
    total=`ls -l . | egrep -c '^-'`

    for i in *.jpg; do
        new=$(printf "%02d.jpg" "$a")
        echo "[$a | $total]: Renaming $i to $new"
        mv "$i" "$1/$new"
        let a=a+1
    done
}
$@

# if declare "$1" > /dev/null
# then
#   "$@"
# else
#   printf "'$1' is not a known function name\n" >&2
#   printf "EXAMPLE COMMAND:\n" >&2
#   printf "./namertopia.sh rename directory/of/photos\n" >&2
#   printf "./namertopia.sh resize directory/of/photos 2800\n" >&2
# fi