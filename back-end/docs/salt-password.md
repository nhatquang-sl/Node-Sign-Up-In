## Use a modern hashing algorithm. 
- Hashing is a one-way function. It is impossible to decrypt a hash to obtain the original value. 
  If an attacker obtains the hashed password, they cannot just enter it into the application to gain access.
- It is important to use a modern hashing function designed to securely store passwords. 
There are a number of modern hashing algorithms that have been specifically designed for securely storing passwords. 
This means that they should be **slow** (unlike algorithms such as MD5 and SHA-1, which were designed to be fast), and how slow they are can be configured by changing the work factor. This makes brutes force attacks unattractive.
## Salt the password
- A salt is a unique randomly generated string that is added to each password as a part of the hashing process. 
Storing a password as a one-way hash is a step in the right direction, but it is not sufficient.  
An attacker can defeat one-way hashes with pre-computation attacks. Some common attacks are rainbow tables and database-based lookups.
With these techniques, a hacker could crack a password in seconds.  
By adding a salt that is unique to each password to the hashing process, it ensures that the hash is unique to each password.
This simple technique makes pre-computation attacks unattractive.
