// ignore_for_file: unnecessary_brace_in_string_interps, avoid_print, non_constant_identifier_names

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goevent_admin/home_page.dart';
import 'package:goevent_admin/agent_chat_screen/auth_service.dart';
import 'package:goevent_admin/api/Api_werper.dart';
import 'package:goevent_admin/api/Data_save.dart';
import 'package:goevent_admin/api/confrigation.dart';
import 'package:goevent_admin/utils/Colors.dart';
import 'package:goevent_admin/utils/custom_widget.dart';
import 'package:http/http.dart' as http;

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final formKey = GlobalKey<FormState>();
  final name = TextEditingController();
  final Mobile = TextEditingController();
  final password = TextEditingController();
  bool isChecked = false;
  bool _obscureText = true;
  void _toggle() {
    setState(() {
      _obscureText = !_obscureText;
    });
  }

  String pagerought = "";
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: WhiteColor,
      appBar: CustomAppbar(
          backbutton: BackButton(
            color: BlackColor,
          ),
          actionicon: null,
          center: true,
          centertext: "Login",
          onclick: () {},
          redi: 0),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 20),
                  child: Text("Let's Sign You In",
                      style: TextStyle(
                          fontFamily: "Gilroy Bold",
                          fontSize: 22,
                          color: BlackColor)),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 5),
                  child: Text("Welcome back, you've been missed",
                      style: TextStyle(
                          fontFamily: "Gilroy Medium",
                          fontSize: 18,
                          color: BlackColor)),
                ),
                Padding(
                    padding: const EdgeInsets.only(top: 30),
                    child: textfield(
                        controller: Mobile,
                        feildcolor: bgcolor,
                        labelcolor: greycolor,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your Email';
                          }
                          return null;
                        },
                        text: "Enter Your Username")),
                Padding(
                    padding: const EdgeInsets.only(top: 25),
                    child: passwordtextfield()),
                Row(
                  children: [
                    Theme(
                      data: ThemeData(unselectedWidgetColor: BlackColor),
                      child: Checkbox(
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(4)),
                        value: isChecked,
                        activeColor: BlackColor,
                        onChanged: (value) {
                          setState(() {
                            isChecked = value!;
                            save("Remember", value);
                          });
                        },
                      ),
                    ),
                    Text(
                      "Remember Me",
                      style: TextStyle(
                          fontSize: 14,
                          fontFamily: "Gilroy Medium",
                          color: BlackColor),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 50),
                  child: GestureDetector(
                      onTap: () {
                        if ((_formKey.currentState?.validate() ?? false)) {
                          login(Mobile.text, password.text);
                        }
                      },
                      child: Container(
                          height: 50,
                          width: double.infinity,
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(18),
                              color: appcolor),
                          child: Center(
                              child: Text("Login",
                                  style: TextStyle(
                                      fontSize: 16,
                                      color: WhiteColor,
                                      fontFamily: "Gilroy Bold"))))),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget passwordtextfield() {
    return Container(
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(15)),
      child: TextFormField(
        controller: password,
        obscureText: _obscureText,
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter your password';
          }
          return null;
        },
        style: TextStyle(
          fontSize: 16,
          color: BlackColor,
        ),
        decoration: InputDecoration(
          suffixIcon: InkWell(
              onTap: () {
                _toggle();
              },
              child: !_obscureText ? Icon(Icons.visibility, color: Darkblue) : Icon(Icons.visibility_off, color: greycolor)),
          labelText: "Password",
          labelStyle: const TextStyle(color: Colors.grey, fontSize: 14),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Darkblue),
            borderRadius: BorderRadius.circular(15),
          ),
          border: const OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(15))),
          enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: Greycolor.withOpacity(0.6),
              ),
              borderRadius: BorderRadius.circular(15)),
        ),
      ),
    );
  }

  login(String email, String password) async {
    try {
      Map map = {"username": email, "password": password};
      Uri uri = Uri.parse(AppUrl.login);
      var response = await http.post(uri, body: jsonEncode(map));
      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);
        pagerought = result["Result"];
        save("currency", result["currency"]);
        save("AdminLogin", result["AdminLogin"]);
        print("*********************${result}");
        print("*********************${getData.read("AdminLogin")}");

        if (pagerought == "true") {
          AuthService().singUpAndStore(email: result["AdminLogin"]["username"], uid: result["AdminLogin"]["id"], proPicPath: "null");
          Get.to(() => const ScanPage());
        } else {
          ApiWrapper.showToastMessage(result["ResponseMsg"]);
        }
      }
      // update();
    } catch (e) {
      print(e.toString());
    }
  }
}
