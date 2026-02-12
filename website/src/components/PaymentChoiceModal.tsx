import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Mail, Building2 } from "lucide-react";

interface PaymentChoiceModalProps {
    open: boolean;
    onClose: () => void;
    onSelfPayment: () => void;
    onNotifyParents: () => void;
    onBankTransfer?: () => void;
    studentCount: number;
    sportName?: string;
}

export default function PaymentChoiceModal({
    open,
    onClose,
    onSelfPayment,
    onNotifyParents,
    onBankTransfer,
    studentCount,
    sportName
}: PaymentChoiceModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Payment Options</DialogTitle>
                    <DialogDescription>
                        You are registering {studentCount} student{studentCount > 1 ? 's' : ''}
                        {sportName && ` for ${sportName}`}. How would you like to proceed with payment?
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-6">
                    <Button
                        onClick={onSelfPayment}
                        className="flex items-center justify-center gap-3 h-auto py-4"
                        variant="default"
                    >
                        <CreditCard className="h-5 w-5" />
                        <div className="text-left">
                            <div className="font-semibold">Pay Now (Card)</div>
                            <div className="text-sm opacity-90">
                                Make payment immediately with credit/debit card
                            </div>
                        </div>
                    </Button>

                    {onBankTransfer && (
                        <Button
                            onClick={onBankTransfer}
                            className="flex items-center justify-center gap-3 h-auto py-4"
                            variant="default"
                        >
                            <Building2 className="h-5 w-5" />
                            <div className="text-left">
                                <div className="font-semibold">Bank Transfer</div>
                                <div className="text-sm opacity-90">
                                    Transfer to bank account and upload payment screenshot
                                </div>
                            </div>
                        </Button>
                    )}

                    <Button
                        onClick={onNotifyParents}
                        className="flex items-center justify-center gap-3 h-auto py-4"
                        variant="outline"
                    >
                        <Mail className="h-5 w-5" />
                        <div className="text-left">
                            <div className="font-semibold">Notify Parents</div>
                            <div className="text-sm opacity-70">
                                Send email to parents to complete payment
                            </div>
                        </div>
                    </Button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <strong>Note:</strong> If you choose to notify parents, they will receive an email
                        with instructions to log in at <strong>rovers.life/login</strong> and complete the payment.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
} 