import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { getFAQs } from "@/api/faqs";
import { getParentChildren } from '@/api/parent';
import { QueryRaisingForm } from "@/components/support/QueryRaisingForm";

export function Support() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true);
        const response = await getFAQs();
        setFaqs(response.faqs || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load FAQs"
        });
      } finally {
        setLoading(false);
      }
    };

    const loadChildren = async () => {
      try {
        const response = await getParentChildren();
        setChildren(response.children || []);
      } catch (error) {
        console.error("Failed to fetch children:", error);
      }
    };

    loadFAQs();
    loadChildren();
  }, [toast]);

  const handleQuerySubmitted = () => {
    setQueryDialogOpen(false);
    toast({
      title: "Success",
      description: "Your query has been submitted successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support</h2>
        <Button onClick={() => setQueryDialogOpen(true)}>
          Raise a Query
        </Button>
      </div>

      <Tabs defaultValue="faqs">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faqs">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="mt-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p>Loading FAQs...</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Common Questions</CardTitle>
                <CardDescription>
                  Find answers to the most commonly asked questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.length > 0 ? (
                    faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No FAQs available at this time.</p>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">roversgwruae@gmail.com</p>
              </div>
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-muted-foreground">+971 585 685 444</p>
              </div>
              <div>
                <h3 className="font-medium">Office Hours</h3>
                <p className="text-muted-foreground">
                  Sunday to Thursday: 9:00 AM - 5:00 PM<br />
                  Friday and Saturday: Closed
                </p>
              </div>
              <Button onClick={() => setQueryDialogOpen(true)} className="mt-4">
                Submit a Support Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Query Dialog */}
      <Dialog open={queryDialogOpen} onOpenChange={setQueryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Raise a Support Query</DialogTitle>
            <DialogDescription>
              Please provide details about your query
            </DialogDescription>
          </DialogHeader>
          <QueryRaisingForm students={children} onSuccess={handleQuerySubmitted} />
        </DialogContent>
      </Dialog>
    </div>
  );
}