import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import moment from "moment";

function Dashboard(){
    // const transactions=[
    //     {
    //         type: "income",
    //         amount: 1200,
    //         tag: "salary",
    //         name: "income 1",
    //         date: "2024-05-23"
    //     },
    //     {
    //         type: "expense",
    //         amount: 800,
    //         tag: "food",
    //         name: "expense 1",
    //         date: "2024-05-17"
    //     }
    // ];

    const [transactions, setTransactions]=useState([]);
    const [loading, setLoading]=useState(false);
    const [user]=useAuthState(auth);
    const [isExpenseModalVisible, setIsExpenseModalVisible]=useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible]=useState(false);
    const showExpenseModal=()=>{
        setIsExpenseModalVisible(true);
    };
    const showIncomeModal=()=>{
        setIsIncomeModalVisible(true);
    };
    const handleExpenseCancel=()=>{
        setIsExpenseModalVisible(false);
    };
    const handleIncomeCancel=()=>{
        setIsIncomeModalVisible(false);
    };

    const onFinish=(values, type)=>{
        const newTransaction={
            type: type,
            date: moment(values.date).format("YYYY-MM-DD"),
            amount: parseFloat(values.amount),
            tag: values.tag,
            name: values.name,
        };
        addTransaction(newTransaction);
    }

    async function addTransaction(transaction){
        try{
            const docRef=await addDoc(
            collection(db, `users/${user.uid}/transactions`),
            transaction
            );
            console.log("Document written in ID:", docRef.id);
            toast.success("Transaction Added!");
        }catch(e){
            console.error("Error adding document", e);
            toast.error("Couldn't add Transaction");
        }
    }

    useEffect(()=>{
        //Get all docs from collection
        fetchTransactions();
    }, []);

    async function fetchTransactions(){
        setLoading(true);
        if(user){
            const q=query(collection(db, `users/${user.uid}/transactions`));
            const querySnapshot=await getDocs(q);
            let transactionsArray=[];
            querySnapshot.forEach((doc)=>{
                //doc.data() is never undefined for query doc snapshots
                transactionsArray.push(doc.data());
            });
            setTransactions(transactionsArray);
            console.log("Transactions Array", transactionsArray);
            toast.success("Transaction fetched");
        }
        setLoading(false);
    }

    return (
        <div>
            <Header/>
            {
                loading? (<p>Loading...</p>)  : 
                (
                    <>
                        <Cards
                        showExpenseModal={showExpenseModal}
                        showIncomeModal={showIncomeModal}
                        />
                        <AddExpenseModal 
                        isExpenseModalVisible={isExpenseModalVisible}
                        handleExpenseCancel={handleExpenseCancel}
                        onFinish={onFinish}/>
                        <AddIncomeModal 
                        isIncomeModalVisible={isIncomeModalVisible}
                        handleIncomeCancel={handleIncomeCancel}
                        onFinish={onFinish}/>
                    </>
                )
            }
        </div>
    )
}

export default Dashboard;