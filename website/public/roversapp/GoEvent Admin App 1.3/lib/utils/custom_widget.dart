// ignore_for_file: non_constant_identifier_names

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goevent_admin/utils/Colors.dart';

textfield(
    {String? text,
    suffix,
    Color? labelcolor,
    Function()? ontap,
    feildcolor,
    double? Width,
    Height,
    TextEditingController? controller,
    String? Function(String?)? validator}) {
  return Container(
      height: Height,
      width: Width,
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(15), color: WhiteColor),
      child: TextFormField(
        onTap: ontap,
        controller: controller,
        decoration: InputDecoration(
          labelText: text,
          labelStyle: TextStyle(
              color: greycolor, fontFamily: "Gilroy Medium", fontSize: 14),
          suffixIcon: Padding(
            padding: const EdgeInsets.all(6),
            child: suffix,
          ),
          border: const OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(15))),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Darkblue),
            borderRadius: BorderRadius.circular(15),
          ),
          enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: Greycolor.withOpacity(0.6),
              ),
              borderRadius: BorderRadius.circular(15)),
        ),
        validator: validator,
      ));
}

CustomAppbar(
    {String? centertext,
    bool? center,
    Widget? backbutton,
    IconData? actionicon,
    Function()? onclick,
    double? redi}) {
  return AppBar(
    elevation: 0,
    backgroundColor: WhiteColor,
    centerTitle: center,
    title: Text(centertext!,
        style: TextStyle(
            fontSize: 18, color: BlackColor, fontFamily: "Gilroy Bold")),
    leading:
        Transform.translate(offset: const Offset(-6, 0), child: backbutton),
    actions: [
      Padding(
        padding: const EdgeInsets.only(right: 8),
        child: InkWell(
          onTap: onclick,
          child: CircleAvatar(
            radius: redi,
            backgroundColor: greycolor.withOpacity(0.4),
            child: Icon(
              actionicon,
              color: BlackColor,
            ),
          ),
        ),
      )
    ],
  );
}

button(clr, text, siz, siz2) {
  return Center(
    child: Container(
      decoration: BoxDecoration(
          borderRadius: const BorderRadius.all(Radius.circular(14)),
          color: clr),
      height: Get.height / 15,
      width: Get.width / 1.3,
      child: Row(
        children: [
          siz,
          Text(text,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w600)),
          siz2,
          Padding(
              padding: const EdgeInsets.symmetric(vertical: 9),
              child: Image.asset("image/arrow.png")),
        ],
      ),
    ),
  );
}

dynamic height;
dynamic width;
