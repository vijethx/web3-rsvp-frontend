import { gql } from "@apollo/client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import client from "../../../apollo-client";
import Alert from "../../../components/Alert";
import DashboardNav from "../../../components/DashboardNav";
import connectContract from "../../../utils/connectContract";
import formatTimestamp from "../../../utils/formatTimestamp";

function PastEvent() {
  const { data: account } = useAccount();
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const [mounted, setMounted] = useState(false);

  const confirmAttendee = async (attendee) => {
    try {
      const rsvpContract = connectContract();

      if (rsvpContract) {
        const txn = await rsvpContract.confirmAttendee(event.id, attendee);
        setLoading(true);
        console.log("Minting...", txn.hash);

        await txn.wait();
        console.log("Minted -- ", txn.hash);
        setSuccess(true);
        setLoading(false);
        setMessage("Attendance has been confirmed.");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setSuccess(false);
      // setMessage(
      //   `Error: ${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}tx/${txn.hash}`
      // );
      setMessage("Error!");
      setLoading(false);
      console.log(error);
    }
  };

  const confirmAllAttendees = async () => {
    console.log("confirmAllAttendees");
    try {
      const rsvpContract = connectContract();
  
      if (rsvpContract) {
        console.log("contract exists");
        const txn = await rsvpContract.confirmAllAttendees(event.id, {
          gasLimit: 300000,
        });
        console.log("await txn");
        setLoading(true);
        console.log("Mining...", txn.hash);
  
        await txn.wait();
        console.log("Mined -- ", txn.hash);
        setSuccess(true);
        setLoading(false);
        setMessage("All attendees confirmed successfully.");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setSuccess(false);
      // setMessage(
      //   `Error: ${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}tx/${txn.hash}`
      // );
      setMessage("Error!");
      setLoading(false);
      console.log(error);
    }
  };

  function checkIfConfirmed(event, address) {
    for (let i = 0; i < event.confirmedAttendees.length; i++) {
      let confirmedAddress = event.confirmedAttendees[i].attendee.id;
      if (confirmedAddress.toLowerCase() == address.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  export async function getServerSideProps(context) {
    const { id } = context.params;
  
    const { data } = await client.query({
      query: gql`
        query Event($id: String!) {
          event(id: $id) {
            id
            eventID
            name
            eventOwner
            eventTimestamp
            maxCapacity
            totalRSVPs
            totalConfirmedAttendees
            rsvps {
              id
              attendee {
                id
              }
            }
            confirmedAttendees {
              attendee {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: id,
      },
    });
  
    return {
      props: {
        event: data.event,
      },
    };
  }

export async function getServerSideProps(context) {
  const { id } = context.params;

  const { data } = await client.query({
    query: gql`
      query Event($id: String!) {
        event(id: $id) {
          id
          eventID
          name
          eventOwner
          eventTimestamp
          maxCapacity
          totalRSVPs
          totalConfirmedAttendees
          rsvps {
            id
            attendee {
              id
            }
          }
          confirmedAttendees {
            attendee {
              id
            }
          }
        }
      }
    `,
    variables: {
      id: id,
    },
  });

  return {
    props: {
      event: data.event,
    },
  };
}
