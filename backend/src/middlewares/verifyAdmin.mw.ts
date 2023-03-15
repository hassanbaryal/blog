import { Request, Response, NextFunction } from 'express';

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { user }: any = req.user;
  if (!user.admin)
    return res.status(403).json({
      message: 'Forbidden action',
    });
  next();
};

export default verifyAdmin;
