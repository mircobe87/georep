#!/bin/bash

DOCDIR=./doc
SRCDIR=./lib

LOGOSRC=./.docimg/logo.png
LOGOLOC=$DOCDIR/assets/css

FAVSRC=./.docimg/favicon.png
FAVLOC=$DOCDIR/assets

# genero la documentazione
yuidoc -o $DOCDIR $SRCDIR

#cambio le immagini della favicon e il logo delle pagine della docu
cp $FAVSRC  $FAVLOC
cp $LOGOSRC $LOGOLOC

exit 0
