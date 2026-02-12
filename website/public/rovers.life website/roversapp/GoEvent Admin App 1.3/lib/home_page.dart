// ignore_for_file: deprecated_member_use

import 'dart:io';
import 'package:barcode_scan2/barcode_scan2.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:goevent_admin/Ticket_Details.dart';
import 'package:goevent_admin/api/Api_werper.dart';
import 'package:goevent_admin/api/Data_save.dart';
import 'package:goevent_admin/login.dart';
import 'package:goevent_admin/utils/Colors.dart';
import 'agent_chat_screen/chats_list.dart';

Map qrCodeResult = {};
String qCodeResult = "";

class ScanPage extends StatefulWidget {
  const ScanPage({Key? key}) : super(key: key);

  @override
  State<ScanPage> createState() => _ScanPageState();
}

class _ScanPageState extends State<ScanPage> {
  blankResponse() {
    setState(() {
      qCodeResult = "";
    });
  }

  @override
  Widget build(BuildContext context) {
    blankResponse();
    final key = GlobalKey<ScaffoldState>();
    return WillPopScope(
      onWillPop: () {
        exit(0);
      },
      child: Scaffold(
        key: key,
        appBar: AppBar(
            backgroundColor: appcolor,
            elevation: 0,
            leading: const BackButton(color: Colors.transparent),
            title: Text('QR Code Scanner', style: TextStyle(color: WhiteColor, fontFamily: "Gilroy Bold")),
            actions: [
              InkWell(
                onTap: () {
                  Get.to(() => const ChatList());
                },
                child: Padding(
                  padding: const EdgeInsets.only(top: 15,bottom: 15),
                  child: Container(
                    height: 30,
                    width: 60,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white),
                      borderRadius: BorderRadius.circular(10)
                    ),
                    child: const Center(child: Text('Chat',style: TextStyle(color: Colors.white))),
                  ),
                ),
              ),
              const SizedBox(width: 15,),
            ],
            centerTitle: true,
        ),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text("Scan the code to see the ticket",
                style: TextStyle(
                    fontSize: 27.0,
                    fontFamily: "Gilroy Bold",
                    color: BlackColor),
                textAlign: TextAlign.center),

            GestureDetector(
              onLongPress: () {},
              child: SelectableText(
                qCodeResult,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontSize: 16.0, fontFamily: "Gilroy Medium"),
                cursorColor: RedColor,
                showCursor: true,
                toolbarOptions: const ToolbarOptions(
                  copy: true,
                  cut: true,
                  paste: true,
                  selectAll: true,
                ),
              ),
            ),
            const SizedBox(
              height: 10.0,
            ),
            Container(
              padding: const EdgeInsets.only(left: 30.0, right: 30.0, top: 20.0),
              height: 68.0,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  foregroundColor: appcolor,
                  backgroundColor: WhiteColor,
                  shape: RoundedRectangleBorder(
                    side: BorderSide(
                      color: appcolor,
                      width: 1.0,
                      style: BorderStyle.solid,
                    ),
                    borderRadius: BorderRadius.circular(32.0),
                  ),
                ),
                onPressed: () async {
                  ScanResult codeScanner = await BarcodeScanner.scan();
                  setState(
                    () {
                      qCodeResult = codeScanner.rawContent;
                    },
                  );
                  if (qCodeResult.isNotEmpty) {
                    Get.to(
                      () => TicketDetailPage(tikitdata: qCodeResult),
                    );
                  } else {
                    ApiWrapper.showToastMessage("Plese Scan Qr Code");
                  }
                  // qCodeResult = "";
                },
                child: const Text(
                  "Scan your QR Code",
                  style: TextStyle(fontSize: 18, fontFamily: "Gilroy Bold"),
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: InkWell(
                  onTap: () {
                    setState(() {
                      // save("Remember", false);
                      save("Firstuser", false);
                      Get.to(() => const LoginScreen());
                    });
                  },
                  child: Align(
                    alignment: Alignment.center,
                    child: Text(
                      "Logout",
                      style: TextStyle(
                          fontFamily: "Gilroy Medium",
                          color: appcolor,
                          fontSize: 16),
                    ),
                  )),
            ),
          ],
        ),
      ),
    );
  }
}
