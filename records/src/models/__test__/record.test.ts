import { Record } from "../record";

it('implements optimistic concurrency control', async () => {
  // create new reocrd
  const record = Record.build({
    title: 'Lazer Guided Melodies',
    price: 30,
    userId: '1234'
  });

  // save record to db
  await record.save();

  //fetch record two times
  const first = await Record.findById(record.id);
  const second = await Record.findById(record.id);

  // make seperate changes to records fetched
  first!.set({ price: 20 });
  second!.set({ price: 25 });

  // save first fetched record
  await first!.save();

  // save second fetched record and expect error 
  try {
    await second!.save();
  } catch (err) {
    return;
  }

  throw new Error('Something wrong if this prints');
});

it('increments version number on multiple saves', async () => {
  const record = Record.build({
    title: 'Lazer Guided Melodies',
    price: 30,
    userId: '1234'
  });

  await record.save();
  expect(record.version).toEqual(0);
  await record.save();
  expect(record.version).toEqual(1);
  await record.save();
  expect(record.version).toEqual(2);
});