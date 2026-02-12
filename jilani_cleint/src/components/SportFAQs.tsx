import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/useToast';
import { getSportFAQs } from '@/api/faqs';

interface SportFAQsProps {
  sportId: string;
}

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export function SportFAQs({ sportId }: SportFAQsProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { 
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await getSportFAQs(sportId);
        if (response.success) {
          setFaqs(response.faqs);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load FAQs"
          });
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load FAQs"
        });
      } finally {
        setLoading(false);
      }
    };

    if (sportId) {
      fetchFAQs();
    }
  }, [sportId]);

  if (loading) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (faqs.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No FAQs available for this sport.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq._id} value={faq._id}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}