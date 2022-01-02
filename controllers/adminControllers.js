const collection = require('../config/collection')
const { ADMIN_COLLECTON, SLOT_COLLECTION } = require('../config/collection')
const db = require('../config/connection')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')


module.exports = {
    login: async (req, res) => {
        const { email, passwrod } = req.body

        try {
            console.log('1');
            let admin = await db.get().collection(collection.ADMIN_COLLECTON).findOne({ email: email })
            console.log('2');

            if (!admin) return res.status(400).json({ error: "invalid " })
            console.log('3');

            // let passwordCheck=await bcrypt.compare(passwrod,admin.passwrod)
            if (passwrod === admin.passwrod) {

                let token = jwt.sign({ email: admin.email, id: admin._id }, 'secret', { expiresIn: "1h" })

                res.status(200).json({ admin, token })
            } else {

                return res.status(400).json({ error: "invalid Admin" })
            }

            console.log('4');


        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    getApplication: async (req, res) => {
        try {
            let Data = await db.get().collection(collection.REGISTER_COLLECTION).find().toArray()

            if (!Data) {
                return res.status(500).json({ error: error.message })
            } else {

                return res.status(200).json({ Data })
            }

        } catch (error) {
            return res.status(500).json({ error: error.message })


        }
    },
    getPendingApplications: async (req, res) => {
        try {
            let Data = await db.get().collection(collection.REGISTER_COLLECTION).find({ Status: "Pending" }).toArray()

            if (!Data) return res.status(500).json({ error: error.message })
            return res.status(200).json({ Data })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getNewApplication: async (req, res) => {
        try {
            let Data = await db.get().collection(collection.REGISTER_COLLECTION).find({ Status: "New" }).sort({ $natural: -1 }).limit(3).toArray()
            console.log(Data);
            if (!Data) return res.status(500).json({ error: error.message })
            return res.status(200).json({ Data })

        } catch (error) {
            return res.status(500).json({ error: error.message })

        }
    },
    updateStatus: (req, res) => {
        return new Promise(async (resolve, reject) => {
            const { Status, id } = req.body

            try {
                //   console.log('jjjjjjjj');
                await db.get().collection(collection.REGISTER_COLLECTION).updateOne({ _id: ObjectId(id) }, { $set: { Status: Status } }).then((Data) => {
                    //    console.log(data);
                    return res.status(200).json({ Data, Status: Status })

                }).catch((error) => {
                    console.log(error);
                })


            } catch (error) {
                console.log(error);
                res.status(500).json({ error: error.message })
            }
        })

    },
    CompanyDetailes: async (req, res) => {
        const { Status, id } = req.body

        try {
            db.get().collection(collection.REGISTER_COLLECTION).findOne({ _id: ObjectId(id) }).then((Data) => {
                return res.status(200).json({ Data })
            }).catch((error) => {
                console.log(error);
            })

        } catch (error) {
            res.status(500).json({ error: error.message })

        }
    }, applySlot: (req, res) => {

        // return new Promise(async (resolve, reject) => {
        //     try {
        //         db.get().collection(collection.SLOT_COLLECTION).insertOne({ Slot, ApplicationId, slotNo, isActive }).then(async (Data) => {
        //             let Datas = await db.get().collection(collection.SLOT_COLLECTION).find().toArray()
        //             // console.log(Datas);
        //             return res.status(200).json({ Datas })
        //         }).catch(err => {
        //             console.log(err, 'llllllloooooo');
        //             res.status(500).json({ error: error.message })

        //         })
        //     } catch (error) {
        //         console.log(error, 'llllll');
        //         res.status(500).json({ error: error.message })

        //     }
        // })
        return new Promise(async (resolve, reject) => {
            console.log(req.body, 'req.body');
            const { Id, cId } = req.body
            console.log(Id, cId, 'id and cid');
            try {
                db.get().collection(collection.SLOT_COLLECTION).updateOne({ _id: ObjectId(Id) },

                    {
                        $set: {
                            Booked: true,
                            Company: ObjectId(cId),
                        },
                    }
                )
                    .then((res) => {
                        console.log(res);
                        db.get()
                            .collection(collection.REGISTER_COLLECTION)
                            .updateOne(
                                { _id: ObjectId(cId) },
                                {
                                    $set: {
                                        Booked: true,
                                    },
                                }
                            )
                            .then((Data) => {
                                console.log("response in form", res);
                                res.status(200).json({ Data });


                                // resolve(res);
                            }).catch(err => {
                                console.log(err);
                            })
                    });
            } catch (error) {
                res.status(500).json({ error: error.message })

            }

        }
        )
    },
    getSlot: async (req, res) => {
        try {
            let Data = await db.get().collection(collection.SLOT_COLLECTION).find().toArray()
            console.log(Data);
            return res.status(200).json({ Data })

        } catch (error) {
            res.status(500).json({ error: error.message })

        }

    },
    getApprovedApplications: async (req, res) => {
        try {
            let Data = await db.get().collection(collection.REGISTER_COLLECTION).find({ Status: "Approve" }).toArray()

            if (!Data) return res.status(500).json({ error: error.message })
            return res.status(200).json({ Data })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    updateSlot: (req, res) => {
        return new Promise(async (resolve, reject) => {
            const { slotId, AppId } = req.body
            try {
                db.get().collection(collection.SLOT_COLLECTION).updateOne({ _id: ObjectId(slotId) }, { $set: { ApplicationId: ObjectId(AppId), isActive: false } }).then(() => {

                    return res.status(200).json({ Data })

                }).catch(error => {
                    return res.status(500).json({ error: error.message })

                })

            } catch (error) {
                return res.status(500).json({ error: error.message })

            }
        })
    },
    getSlotData: async (req, res) => {
        console.log(req.body);
        const { sId } = req.body;
        console.log(sId);

        try {
            let Data = await db.get().collection(collection.REGISTER_COLLECTION).findOne({ _id: ObjectId(sId) })


            if (!Data) return res.status(500).json({ error: error.message })

            return res.status(200).json({ Data })




            // db.get()
            // .collection(collection.REGISTER_COLLECTION)
            // .findOne({ _id: ObjectId(sId)})
            // .then((res) => {
            //     console.log(res);
            //    return res.status(200).json({res});
            //     // resolve(res);
            // }).catch(error=>{
            //     return res.status(500).json({ error: error.message,m:'hhghgh' })

            // })
        } catch (error) {
            return res.status(500).json({ error: error.message })

        }


    },
    addSlot:async(req,res)=>{
        const {Name}=req.body
        try {
           db.get().collection(collection.SLOT_COLLECTION).insertOne({Name}).then(async(res)=>{

            let Data=await db.get().collection(collection.SLOT_COLLECTION).find().toArray()

            return res.status(200).json({ Data })


            


           }).catch(error=>{
            return res.status(500).json({ error: error.message })

            //    console.log(error);
           })
        } catch (error) {
            return res.status(500).json({ error: error.message })
            
        }
    }

}