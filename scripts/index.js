
import {Observable} from 'frzr'

import debug from './debug'
import title from './title'
import todocreate from './todocreate'
import todoitems from './todoitems'

var $rendertime = document.getElementById('rendertime')
var $container = document.getElementById('container')
var root = new Observable()

// mount debug
debug(root, $rendertime)

// mount title
title(root, $container)

// mount input
todocreate(root, $container)

// mount items
todoitems(root, $container)
