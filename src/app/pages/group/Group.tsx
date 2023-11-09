import React, { useState, ChangeEvent, Fragment } from "react";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import RemoveGroupMember from "./components/RemoveGroupMember";
import AddGroupMember from "./components/AddGroupMember";
import AddGroup from "./components/AddGroup";
import Events from "../event/Events";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS
import AITable from "./AI/AITable";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { set } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShiftingCountdown from "./components/ShiftingCountdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function GroupComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [group, setGroup] = useState<any>(null);
  const [editingGroup, setEditingGroup] = useState<any>(null); //Delete group and edit group
  const [groupName, setGroupName] = useState("");
  const allGroups = useQuery(api.group.getAllGroupsForUser) || [];
  const deleteGroupMutation = useMutation(api.group.deleteGroup); // Assuming this is your delete group mutation

  const handleRowClick = (group: any) => {
    setGroup(group);
    setIsOpen(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroupMutation({ groupID: String(groupId) });
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleGroupNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setGroupName(event.target.value);
  };

  return (
    <>
      {/* grid-cols-1 lg:grid-cols-5 gap-4 */}
      <div className="">
        <div>
          <div className="flex justify-between m-10 ">
            <h1 className="text-left text-2xl font-medium text-white">
              Upcoming Events
            </h1>
            <div className="text-right">
              <UserButton />
            </div>
          </div>

          <div className="justify-center">
            <Separator className="w-90" orientation="horizontal" />
          </div>
        </div>
        <div
          className="grid m-5 grid-cols-5 overflow-x-auto gap-4 border-gray-50 border-opacity-50 h-screen"
          style={{ height: "30vh" }}
        >
          <Card className="mt-2.5 mb-2.5 bg-blue-50"></Card>
          <Card className="mt-2.5 mb-2.5 bg-green-100"></Card>
          <Card className="mt-2.5 mb-2.5 bg-yellow-200"></Card>
          <Card className="mt-2.5 mb-2.5 bg-red-200 "></Card>
          <Card className="mt-2.5 mb-2.5 bg-purple-200"></Card>
        </div>
      </div>
      <div className="m-5 bg-dark-foreground border border-gray-50 border-opacity-25">
        <div className="flex justify-between m-10 ">
          <h1 className="text-left text-2xl font-medium text-white">Groups</h1>
          <p className="text-right">Options</p>
        </div>
        <div className="justify-center">
          <Separator className="w-90 mr-10 ml-10" orientation="horizontal" />
        </div>{" "}
        <Tabs className="flex ml-5 m-10" defaultValue="account">
          <div>
            <TabsList className="grid mt-5 mb-5 bg-transparent ">
              <Input type="name" placeholder="Group Search" className="mb-10" />
              <TabsTrigger
                className="text-md hover:bg-transparent hover:underline "
                value="account"
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                className="text-md mt-5 hover:bg-transparent hover:underline"
                value="a"
              >
                Group1
              </TabsTrigger>
              <TabsTrigger
                className="text-md mt-5 hover:bg-transparent hover:underline"
                value="d"
              >
                Group2
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="account" className="w-screen ml-10">
            <div>
              <CardHeader>
                <CardTitle>Group</CardTitle>
                <CardDescription>
                  abc@gmail.com, hi@gmail.com, test@gmail.com
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Events></Events>
                {/* <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="Pedro Duarte" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="@peduarte" />
                    </div> */}
              </CardContent>
              <CardFooter></CardFooter>
            </div>
          </TabsContent>
          {/* <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged
                      out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent> */}
        </Tabs>
      </div>
      <ShiftingCountdown />
      <div className="m-5 bg-dark-foreground border border-gray-50 border-opacity-25">
        <div className="justify-center flex">
          <h1 className="m-2.5 text-2xl font-medium text-white">Your Tools</h1>
        </div>
        <AITable></AITable>
      </div>

      <Accordion type="single" collapsible className="m-10">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <div>
        <Card className="m-10 justify-center flex">
          <h1 className="m-2.5 text-2xl font-medium text-white">Your Tools</h1>
        </Card>
      </div> */}
    </>
  );
}
// <div className="justify-center">
//   <div className="m-5 px-6">
//     <AddGroup />
//   </div>
//   <Card>
//     <Table>
//       <TableHeader>
//         <TableRow className="justify-between">
//           <TableHead className="w-[400px]">Groups</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {allGroups.map((group) => (
//           <TableRow className="h-[75px]">
//             <TableCell
//               onClick={() => handleRowClick(group)}
//               className="text-lg"
//             >
//               {group.name}
//             </TableCell>
//             {group.groupMembers.map((item: any, index: any) => (
//               <>
//                 <TableCell
//                   key={index}
//                   className="align-middle justify-end"
//                 >
//                   <p className="text-xs">{item}</p>
//                 </TableCell>
//               </>
//             ))}
//             <TableCell className="text-right">
//               {editingGroup === group ? (
//                 <Input
//                   defaultValue={group.name}
//                   onChange={(e) => handleGroupNameChange(e, group)} // You'll need to implement the handleGroupNameChange function
//                 />
//               ) : (
//                 <Fragment>
//                   {/* <Button onClick={() => handleEditGroup(group)}>Edit</Button> */}
//                   <Button
//                     onClick={() => handleDeleteGroup(group._id)}
//                   >
//                     Delete
//                   </Button>
//                 </Fragment>
//               )}
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </Card>
// </div>
