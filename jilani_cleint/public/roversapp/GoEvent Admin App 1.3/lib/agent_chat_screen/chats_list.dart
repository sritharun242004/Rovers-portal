// ignore_for_file: avoid_print, unnecessary_brace_in_string_interps

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../api/Data_save.dart';
import '../api/confrigation.dart';
import 'chat_screen.dart';
import 'chat_service.dart';

class ChatList extends StatefulWidget {
  const ChatList({Key? key}) : super(key: key);

  @override
  State<ChatList> createState() => _ChatListState();
}

class _ChatListState extends State<ChatList> {
  // late ColorNotifire notifire;
  TextEditingController searchController = TextEditingController();
  List searchList = [];
  List _searchIndexList = [];

  @override
  void dispose() {
    super.dispose();
    searchiteams.clear();
  }

  @override
  Widget build(BuildContext context) {
    // notifire = Provider.of<ColorNotifire>(context, listen: true);
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
          backgroundColor: Colors.white,
          centerTitle: true,
          elevation: 0,
          leading: BackButton(
            color: Colors.black,
            onPressed: () {
              Get.back();
            },
          ),
          title: const Text(
            "Chats",
            style: TextStyle(
              fontSize: 18,
              color: Colors.black,
            ),
          )),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15),
            child: TextField(
                style: const TextStyle(color: Colors.black),
                controller: searchController,
                decoration: InputDecoration(
                    contentPadding: const EdgeInsets.all(15),
                    isDense: true,
                    hintStyle: const TextStyle(color: Colors.black),
                    hintText: "Search..",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xffF0F0F0))),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xffF0F0F0))),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Colors.blue)),
                    disabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xffF0F0F0))),
                    errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xffF0F0F0)))),
                onChanged: (s) {
                  _searchIndexList = [];
                  for (int i = 0; i < searchiteams.length; i++) {
                    if (searchiteams[i]["name"].toLowerCase().contains(s.toLowerCase())) {
                      final ids = searchiteams.map<String>((e) => e['uid']!).toSet();

                      searchiteams.retainWhere((Map x) {
                        return ids.remove(x['uid']);
                      });

                      setState(() {});
                      _searchIndexList.add(i);
                    } else {
                      setState(() {});
                    }
                  }
                }),
          ),
          searchController.text.isEmpty
              ? Expanded(child: _buildUserList())
              : _searchIndexList.isEmpty
                  ? const Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text("User Not Found"),
                        ],
                      ),
                    )
                  : Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        itemCount: _searchIndexList.length,
                        itemBuilder: (context, index) {
                          var result = _searchIndexList[index];
                          bool imageisemty =
                              searchiteams[result]["image"] == 'null';
                          return ListTile(
                            onTap: () {
                              Get.to(ChatPage(
                                proPic: searchiteams[result]["image"],
                                resiverUserId: searchiteams[result]["uid"],
                                resiverUseremail: searchiteams[result]["name"],
                              ));
                            },
                            subtitle: Text(searchiteams[result]["message"],
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Colors.black
                                )),
                            trailing: Text(
                                DateFormat('hh:mm a')
                                    .format(DateTime.fromMicrosecondsSinceEpoch(
                                        searchiteams[result]["timestamp"]
                                            .microsecondsSinceEpoch))
                                    .toString(),
                                style: const TextStyle(
                                  fontSize: 10,
                                  color: Colors.black
                                )),
                            leading: imageisemty
                                ? const CircleAvatar(
                                    backgroundColor: Colors.transparent,
                                    radius: 25,
                                    backgroundImage: AssetImage(
                                      "assets/images/profile-default.png",
                                    ))
                                : CircleAvatar(
                                    backgroundColor: Colors.transparent,
                                    radius: 25,
                                    backgroundImage: NetworkImage(
                                        "${AppUrl.baseUrl}${searchiteams[result]["image"]}")),
                            title: Text(
                              searchiteams[result]["name"].toString(),
                              style:
                                  const TextStyle(color: Colors.black),
                            ),
                          );
                        },
                      ),
                    ),
        ],
      ),
    );
  }

  Widget _buildUserList() {
    return StreamBuilder<QuerySnapshot<Object?>>(
        stream: FirebaseFirestore.instance.collection("users").snapshots(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const Text("Error");
          }
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else {
            return ListView(
              children: snapshot.data!.docs.map<Widget>((doc) {
                return _buildUserListIteam(doc, snapshot.data!.docs.length);
              }).toList(),
            );
          }
        });
  }

  ChatServices chatservices = ChatServices();

  Widget _buildUserListIteam(DocumentSnapshot document, int legth) {
    Map<String, dynamic> data = document.data()! as Map<String, dynamic>;

    List ids = [data["uid"], getData.read("AdminLogin")["id"]];
    ids.sort();

    // String chatRoomId = ids.join("_");

    if (getData.read("AdminLogin")["name"] != data["name"]) {
      return StreamBuilder<QuerySnapshot<Object?>>(
          stream: chatservices.getMessage(
              userId: data["uid"],
              otherUserId: getData.read("AdminLogin")["id"]),
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Text("Error${snapshot.error}");
            }

            if (snapshot.connectionState == ConnectionState.waiting) {
              return const SizedBox();
            } else {
              return snapshot.data!.docs.isEmpty
                  ? const SizedBox()
                  : _buildMessageiteam(snapshot.data!.docs.last, data["name"],
                      data["uid"], data["pro_pic"].toString(), legth, snapshot);
            }
          });

      // FutureBuilder(
      //     future: isMeassageAvalable(chatRoomId),
      //     builder: (BuildContext context, snapshot) {
      //       if (snapshot.connectionState == ConnectionState.waiting) {
      //         return ListTile(
      //           title: Text(data["name"]),
      //           onTap: () {
      //             Get.to(ChatPage(
      //               resiverUserId: data["uid"],
      //               resiverUseremail: data["name"],
      //             ));
      //           },
      //         );
      //       } else {
      //         return snapshot.data == 0
      //             ? const SizedBox()
      //             : ListTile(
      //                 title: Text(data["name"]),
      //                 // title: Text(snapshot.data.toString()),
      //                 onTap: () {
      //                   Get.to(ChatPage(
      //                     resiverUserId: data["uid"],
      //                     resiverUseremail: data["name"],
      //                   ));
      //                 },
      //               );
      //       }
      //     });
    } else {
      return Container();
    }
  }

  List<Map> searchiteams = [];
  Widget _buildMessageiteam(DocumentSnapshot document, String email, String uid,
      String proPic, int legnth, var snapshot) {
    Map<String, dynamic> data = document.data() as Map<String, dynamic>;

    if (searchiteams.length < legnth - 1) {
      if (snapshot.data!.docs.isNotEmpty) {
        searchiteams.add({
          "name": email,
          "image": proPic,
          "uid": uid,
          "message": data["message"],
          "timestamp": data["timestamp"]
        });

        // for (var dataa in searchiteams) {
        //   print(dataa);
        //   if (dataa["uid"].contains(data["uid"])) {

        //   }
        // }
      }
    }
    return ListTile(
        onTap: () {
          print("+++++++++++++++---------------***********${proPic}");
          Get.to(ChatPage(
            proPic: proPic,
            resiverUserId: uid,
            resiverUseremail: email,
          ));
        },
        leading: proPic == ""
            ? const CircleAvatar(
                backgroundColor: Colors.transparent,
                radius: 25,
                backgroundImage: AssetImage(
                  "assets/images-removebg-preview.png",
                ))
            : ClipRRect(
             borderRadius: BorderRadius.circular(30),
              child: Image.network("http://15.207.11.52/event_vibes/$proPic",fit: BoxFit.fill,height: 40,
                width: 40,
                errorBuilder: (context, error, stackTrace) {
                return Image.asset("assets/images-removebg-preview.png",height: 40,width: 40,);
              },),
            ),
        title: Text(
          email,
          style: const TextStyle(color: Colors.black),
        ),
        subtitle: Text(
          data["message"],
          style: const TextStyle(
            fontSize: 14,
            color: Colors.black
          ),
        ),
        trailing: Text(
            DateFormat('hh:mm a')
                .format(DateTime.fromMicrosecondsSinceEpoch(
                    data["timestamp"].microsecondsSinceEpoch))
                .toString(),
            style: const TextStyle(
              fontSize: 10,
              color: Colors.black
            )));
  }

  Future<dynamic> isMeassageAvalable(String chatroom) async {
    CollectionReference collectionReference =
        FirebaseFirestore.instance.collection('chat_rooms');
    var data0 =
        await collectionReference.doc(chatroom).collection("message").get();

    return data0.docs.length;
  }
}
