import 'package:flutter/material.dart';

class ChatBubble extends StatelessWidget {
  final String message;
  final bool alingment;
  final Color chatColor;
  final Color textColor;
  const ChatBubble(
      {Key? key,
      required this.message,
      required this.alingment,
      required this.chatColor,
      required this.textColor}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(alingment ? 0 : 12),
            topLeft: const Radius.circular(12),
            topRight: const Radius.circular(12),
            bottomRight: Radius.circular(alingment ? 12 : 0)),
        color: chatColor,
      ),
      child: Text(
        message,
        style: TextStyle(
            fontSize: 16,
            color: textColor,
            ),
      ),
    );
  }
}
