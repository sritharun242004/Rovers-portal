// To parse this JSON data, do
//
//     final ticketInfo = ticketInfoFromJson(jsonString);

import 'dart:convert';

TicketInfo ticketInfoFromJson(String str) =>
    TicketInfo.fromJson(json.decode(str));

String ticketInfoToJson(TicketInfo data) => json.encode(data.toJson());

class TicketInfo {
  TicketInfo({
    required this.ticketId,
    required this.ticketTitle,
    required this.startTime,
    required this.eventAddress,
    required this.eventAddressTitle,
    required this.eventLatitude,
    required this.eventLongtitude,
    required this.eventSponsore,
    required this.ticketUsername,
    required this.ticketMobile,
    required this.ticketEmail,
    required this.ticketType,
    required this.totalTicket,
    required this.ticketSubtotal,
    required this.ticketCouAmt,
    required this.ticketWallAmt,
    required this.ticketTax,
    required this.ticketTotalAmt,
    this.ticketPMethod,
    required this.ticketTransactionId,
    required this.ticketStatus,
  });

  String ticketId;
  String ticketTitle;
  String startTime;
  String eventAddress;
  String eventAddressTitle;
  String eventLatitude;
  String eventLongtitude;
  List<EventSponsore> eventSponsore;
  String ticketUsername;
  String ticketMobile;
  String ticketEmail;
  String ticketType;
  String totalTicket;
  String ticketSubtotal;
  String ticketCouAmt;
  String ticketWallAmt;
  String ticketTax;
  String ticketTotalAmt;
  dynamic ticketPMethod;
  String ticketTransactionId;
  String ticketStatus;

  factory TicketInfo.fromJson(Map<String, dynamic> json) => TicketInfo(
        ticketId: json["ticket_id"],
        ticketTitle: json["ticket_title"],
        startTime: json["start_time"],
        eventAddress: json["event_address"],
        eventAddressTitle: json["event_address_title"],
        eventLatitude: json["event_latitude"],
        eventLongtitude: json["event_longtitude"],
        eventSponsore: List<EventSponsore>.from(
            json["event_sponsore"].map((x) => EventSponsore.fromJson(x))),
        ticketUsername: json["ticket_username"],
        ticketMobile: json["ticket_mobile"],
        ticketEmail: json["ticket_email"],
        ticketType: json["ticket_type"],
        totalTicket: json["total_ticket"],
        ticketSubtotal: json["ticket_subtotal"],
        ticketCouAmt: json["ticket_cou_amt"],
        ticketWallAmt: json["ticket_wall_amt"],
        ticketTax: json["ticket_tax"],
        ticketTotalAmt: json["ticket_total_amt"],
        ticketPMethod: json["ticket_p_method"],
        ticketTransactionId: json["ticket_transaction_id"],
        ticketStatus: json["ticket_status"],
      );

  Map<String, dynamic> toJson() => {
        "ticket_id": ticketId,
        "ticket_title": ticketTitle,
        "start_time": startTime,
        "event_address": eventAddress,
        "event_address_title": eventAddressTitle,
        "event_latitude": eventLatitude,
        "event_longtitude": eventLongtitude,
        "event_sponsore":
            List<dynamic>.from(eventSponsore.map((x) => x.toJson())),
        "ticket_username": ticketUsername,
        "ticket_mobile": ticketMobile,
        "ticket_email": ticketEmail,
        "ticket_type": ticketType,
        "total_ticket": totalTicket,
        "ticket_subtotal": ticketSubtotal,
        "ticket_cou_amt": ticketCouAmt,
        "ticket_wall_amt": ticketWallAmt,
        "ticket_tax": ticketTax,
        "ticket_total_amt": ticketTotalAmt,
        "ticket_p_method": ticketPMethod,
        "ticket_transaction_id": ticketTransactionId,
        "ticket_status": ticketStatus,
      };
}

class EventSponsore {
  EventSponsore({
    required this.sponsoreId,
    required this.sponsoreImg,
    required this.sponsoreTitle,
  });

  String sponsoreId;
  String sponsoreImg;
  String sponsoreTitle;

  factory EventSponsore.fromJson(Map<String, dynamic> json) => EventSponsore(
        sponsoreId: json["sponsore_id"],
        sponsoreImg: json["sponsore_img"],
        sponsoreTitle: json["sponsore_title"],
      );

  Map<String, dynamic> toJson() => {
        "sponsore_id": sponsoreId,
        "sponsore_img": sponsoreImg,
        "sponsore_title": sponsoreTitle,
      };
}
