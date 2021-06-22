#  connect to firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate("secret.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
ref = db.collection('emails')

# initiate outlook
import win32com.client
import win32com
import os
import sys
outlook=win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")

# access CRM mailbox and its sub folders
folder = outlook.Folders.Item("CRM")
inbox = folder.Folders.Item("Inbox")
test =inbox.Folders.Item("test")
donetest = inbox.Folders.Item("donetest")
messages = test.Items
for message in messages:
    
    
    #  save to firebase
    ref.add({'sender': message.SenderEmailAddress, 'subject': message.Subject,'date':message.LastModificationTime,'cc':message.CC,'body':message.body})
    # move saved email out of this folder
    message.Move(donetest)

