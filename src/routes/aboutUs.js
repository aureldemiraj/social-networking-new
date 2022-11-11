import fs from 'fs/promises';
import { catchAsync } from './../common/catchAsync.js';


const aboutUs = catchAsync(async (req, res, next) => {
    const data = await fs.readFile('./test.txt', 'utf-8');

    res.status(200).json({
        status: 'success',
        data
    });
});

export default aboutUs;