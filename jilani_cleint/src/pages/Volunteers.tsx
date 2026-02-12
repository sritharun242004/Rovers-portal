import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"
import { useEffect } from "react"
import { getVolunteers } from "@/api/volunteer"
import { QrScannerDialog } from "@/components/QrScannerDialog"

interface Volunteer {
  _id: string
  name: string
  email: string
  password: string
}

export function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [showScanner, setShowScanner] = useState(false)

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await getVolunteers()
        setVolunteers(response.volunteers)
      } catch (error) {
        console.error('Failed to fetch volunteers:', error)
      }
    }
    fetchVolunteers()
  }, [])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registered Volunteers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((volunteer) => (
                <TableRow key={volunteer._id}>
                  <TableCell>{volunteer.name}</TableCell>
                  <TableCell>{volunteer.email}</TableCell>
                  <TableCell>{volunteer.password}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <QrScannerDialog
        open={showScanner}
        onOpenChange={setShowScanner}
        checkpoint="volunteer-verification"
      />
    </>
  )
}