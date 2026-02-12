// ignore_for_file: file_names, duplicate_ignore, avoid_print, dead_code, unused_import
// ignore_for_file: file_names
import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:goevent_admin/api/confrigation.dart';
import 'package:goevent_admin/utils/Colors.dart';
import 'package:http/http.dart' as http;

//! Api Call
class ApiWrapper {
  static var headers = {
    'Content-Type': 'application/json',
    'Cookie': 'PHPSESSID=oonu3ro0agbeiik4t0l6egt8ab'
  };


  static showToastMessage(message) {
    Fluttertoast.showToast(
        msg: message,
        gravity: ToastGravity.BOTTOM,
        timeInSecForIosWeb: 1,
        backgroundColor: gradientColor.withOpacity(0.9),
        textColor: Colors.white,
        fontSize: 14.0);
  }


}
